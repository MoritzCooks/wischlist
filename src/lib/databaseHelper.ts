import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  UpdateData,
  updateDoc,
  WithFieldValue,
} from "firebase/firestore";
import { firestore } from "./firebase";

export class DatabaseHelper<T extends DocumentData> {
  private db: CollectionReference<T>;

  constructor(collectionName: string) {
    // @ts-ignore
    this.db = collection(firestore, collectionName);
  }

  private getReference = (id: string) => doc(this.db, id);

  public get = async (id: string) => {
    const ref = this.getReference(id);
    const document = await getDoc<T>(ref);
    return {
      ...document.data(),
      id: document.id,
    };
  };

  public getAll = async () => {
    const docs = await (await getDocs<T>(this.db)).docs;
    return docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
  };

  public add = async (data: WithFieldValue<T>) => {
    const ref = await addDoc<T>(this.db, data);
    const addedDoc = await getDoc<T>(ref);
    return {
      wish: "", // set wish as default empty array. Will be overwritten if present in data()
      ...addedDoc.data(),
      id: addedDoc.id,
    };
  };

  public update = async (id: string, data: UpdateData<T>) => {
    const ref = this.getReference(id);
    await updateDoc(ref, data);
  };

  public delete = async (id: string) => {
    const ref = this.getReference(id);
    await deleteDoc(ref);
  };
}
