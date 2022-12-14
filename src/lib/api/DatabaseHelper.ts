import firebase from "./db"

export class DatabaseHelper<T> {
  private collection
  private firestore

  constructor(collectionName: string) {
    this.firestore = firebase.firestore()
    this.collection = this.firestore.collection(collectionName)
  }

  private getReferenceById = (id: string) => {
    return this.collection.doc(id)
  }

  public get = async (id: string) => {
    const document = await this.getReferenceById(id).get()
    return {
      ...document.data(),
      id: document.id,
    } as T
  }

  public where = async (
    ...condition: [
      fieldPath: string | FirebaseFirestore.FieldPath,
      opStr: FirebaseFirestore.WhereFilterOp,
      value: any
    ]
  ) => {
    const result = await this.collection.where(...condition).get()
    return result.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as T
    })
  }

  public getAll = async () => {
    const result = await this.collection.get()
    return result.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as T
    })
  }

  public add = async (data: Omit<T, "id">) => {
    const ref = await this.collection.add(data)
    const added = await ref.get()
    return {
      ...added.data(),
      id: added.id,
    } as T
  }

  public update = async (id: string, data: Partial<T>) => {
    const ref = this.getReferenceById(id)
    return await ref.set(data, { merge: true })
  }

  public delete = async (id: string) => {
    const ref = this.getReferenceById(id)
    return await ref.delete()
  }
}
