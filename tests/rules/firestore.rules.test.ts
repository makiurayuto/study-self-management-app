// Firestore セキュリティルールのテスト（npm run test:rules で Emulator 上で実行）
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

let env: RulesTestEnvironment;

const TEACHER = "teacher1";
const ALICE = "alice";
const BOB = "bob";

const validLog = (uid: string, date: string) => ({
  uid,
  date,
  studyTime: 120,
  phoneTime: 60,
  sleepTime: "23:00",
  satisfaction: "○",
});

const db = (uid?: string) =>
  uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore();

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-study-app",
    firestore: { rules: readFileSync(process.env.RULES_FILE ?? "firestore.rules", "utf8") },
  });
});

afterAll(async () => {
  await env.cleanup();
});

// 先生1人・登録済み生徒 Alice・Bob と、Alice のログ1件
beforeEach(async () => {
  await env.clearFirestore();

  await env.withSecurityRulesDisabled(async (ctx) => {
    const f = ctx.firestore();
    await setDoc(doc(f, "users", TEACHER), { name: "先生", role: "teacher", schoolId: null });

    for (const uid of [ALICE, BOB]) {
      await setDoc(doc(f, "users", uid), { name: uid, role: "student", schoolId: null });
      await setDoc(doc(f, "students", uid), {
        name: uid, status: "active", schoolId: null, hiddenAt: null, graduatedAt: null,
      });
    }

    await setDoc(doc(f, "weeklyLogs", ALICE, "logs", "2026-11-02"), validLog(ALICE, "2026-11-02"));
  });
});

describe("users", () => {
  it("新規登録：role=student で users と students を batch 作成できる", async () => {
    const f = db("carol");
    const batch = writeBatch(f);
    batch.set(doc(f, "users", "carol"), { name: "Carol", role: "student", schoolId: null });
    batch.set(doc(f, "students", "carol"), {
      name: "Carol", status: "active", schoolId: null, hiddenAt: null, graduatedAt: null,
    });
    await assertSucceeds(batch.commit());
  });

  it("新規登録：自分を teacher として作成できない", async () => {
    await assertFails(
      setDoc(doc(db("carol"), "users", "carol"), { name: "Carol", role: "teacher", schoolId: null })
    );
  });

  it("他人の users は作成できない", async () => {
    await assertFails(
      setDoc(doc(db("carol"), "users", "dave"), { name: "Dave", role: "student", schoolId: null })
    );
  });

  it("生徒は自分の role を teacher に変更できない", async () => {
    await assertFails(updateDoc(doc(db(ALICE), "users", ALICE), { role: "teacher" }));
  });

  it("先生も role は変更できない", async () => {
    await assertFails(updateDoc(doc(db(TEACHER), "users", ALICE), { role: "teacher" }));
  });

  it("生徒は自分の名前を変更できる", async () => {
    await assertSucceeds(updateDoc(doc(db(ALICE), "users", ALICE), { name: "Alice2" }));
  });

  it("空の名前には変更できない", async () => {
    await assertFails(updateDoc(doc(db(ALICE), "users", ALICE), { name: "" }));
  });

  it("生徒は他人の users を読めない・先生は読める", async () => {
    await assertFails(getDoc(doc(db(ALICE), "users", BOB)));
    await assertSucceeds(getDoc(doc(db(TEACHER), "users", BOB)));
  });

  it("未ログインは読めない", async () => {
    await assertFails(getDoc(doc(db(), "users", ALICE)));
  });

  it("users の削除は先生のみ", async () => {
    await assertFails(deleteDoc(doc(db(ALICE), "users", ALICE)));
    await assertSucceeds(deleteDoc(doc(db(TEACHER), "users", ALICE)));
  });
});

describe("students", () => {
  it("生徒は自分の status を変更できない", async () => {
    await assertFails(updateDoc(doc(db(ALICE), "students", ALICE), { status: "hidden" }));
  });

  it("生徒は自分の名前を変更できる", async () => {
    await assertSucceeds(updateDoc(doc(db(ALICE), "students", ALICE), { name: "Alice2" }));
  });

  it("新規作成時に status=active 以外は不可", async () => {
    await assertFails(
      setDoc(doc(db("carol"), "students", "carol"), {
        name: "Carol", status: "graduated", schoolId: null, hiddenAt: null, graduatedAt: null,
      })
    );
  });

  it("先生は status を変更できる（非表示・退塾・復帰）", async () => {
    const f = db(TEACHER);
    await assertSucceeds(updateDoc(doc(f, "students", ALICE), { status: "hidden", hiddenAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(f, "students", ALICE), { status: "graduated", graduatedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(f, "students", ALICE), { status: "active" }));
  });

  it("先生でも不正な status にはできない", async () => {
    await assertFails(updateDoc(doc(db(TEACHER), "students", ALICE), { status: "deleted" }));
  });

  it("生徒は他人の students を読めない", async () => {
    await assertFails(getDoc(doc(db(ALICE), "students", BOB)));
  });

  it("削除は先生のみ", async () => {
    await assertFails(deleteDoc(doc(db(ALICE), "students", ALICE)));
    await assertSucceeds(deleteDoc(doc(db(TEACHER), "students", ALICE)));
  });
});

describe("weeklyLogs/{uid}/logs/{date}", () => {
  const logRef = (as: string | undefined, owner: string, date: string) =>
    doc(db(as), "weeklyLogs", owner, "logs", date);

  it("生徒は自分のログを保存・上書きできる", async () => {
    await assertSucceeds(setDoc(logRef(ALICE, ALICE, "2026-11-03"), validLog(ALICE, "2026-11-03")));
    await assertSucceeds(setDoc(logRef(ALICE, ALICE, "2026-11-02"), validLog(ALICE, "2026-11-02")));
  });

  it("他人のログは保存できない（先生も不可）", async () => {
    await assertFails(setDoc(logRef(BOB, ALICE, "2026-11-03"), validLog(ALICE, "2026-11-03")));
    await assertFails(setDoc(logRef(TEACHER, ALICE, "2026-11-03"), validLog(ALICE, "2026-11-03")));
  });

  it("uid / date がパスと一致しないログは保存できない", async () => {
    await assertFails(setDoc(logRef(ALICE, ALICE, "2026-11-03"), validLog(BOB, "2026-11-03")));
    await assertFails(setDoc(logRef(ALICE, ALICE, "2026-11-03"), validLog(ALICE, "2026-11-04")));
  });

  it("不正な値は保存できない", async () => {
    const ref = logRef(ALICE, ALICE, "2026-11-03");
    await assertFails(setDoc(ref, { ...validLog(ALICE, "2026-11-03"), studyTime: -1 }));
    await assertFails(setDoc(ref, { ...validLog(ALICE, "2026-11-03"), phoneTime: 2000 }));
    await assertFails(setDoc(ref, { ...validLog(ALICE, "2026-11-03"), satisfaction: "最高" }));
    await assertFails(setDoc(ref, { ...validLog(ALICE, "2026-11-03"), extra: true }));
  });

  it("本人と先生は読める・他の生徒は読めない", async () => {
    await assertSucceeds(getDoc(logRef(ALICE, ALICE, "2026-11-02")));
    await assertSucceeds(getDoc(logRef(TEACHER, ALICE, "2026-11-02")));
    await assertFails(getDoc(logRef(BOB, ALICE, "2026-11-02")));
  });

  it("collectionGroup で日付検索できるのは先生のみ", async () => {
    const q = (as: string) =>
      query(collectionGroup(db(as), "logs"), where("date", "==", "2026-11-02"));

    await assertSucceeds(getDocs(q(TEACHER)));
    await assertFails(getDocs(q(ALICE)));
  });

  it("collectionGroup の期間検索（今週分）も先生のみ", async () => {
    const q = (as: string) =>
      query(
        collectionGroup(db(as), "logs"),
        where("date", ">=", "2026-11-02"),
        where("date", "<=", "2026-11-08")
      );

    await assertSucceeds(getDocs(q(TEACHER)));
    await assertFails(getDocs(q(ALICE)));
  });

  it("削除は本人と先生", async () => {
    await assertFails(deleteDoc(logRef(BOB, ALICE, "2026-11-02")));
    await assertSucceeds(deleteDoc(logRef(TEACHER, ALICE, "2026-11-02")));
  });
});

describe("移行前の構造", () => {
  it("weeklyLogs 直下には書き込めない", async () => {
    await assertFails(setDoc(doc(db(ALICE), "weeklyLogs", "x"), { uid: ALICE }));
  });
});
