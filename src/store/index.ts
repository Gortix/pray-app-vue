import { Pray, User } from "./../@types/database";
import { defineStore } from "pinia";
import app from "@/@firebase";
import {
  collection,
  getDocs,
  getFirestore,
  doc as firebaseDoc,
  getDoc,
  Timestamp,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const db = getFirestore(app);

export const getRelatedDoc = async (path: string) => {
  const doc = await getDoc(firebaseDoc(db, path));
  return { ...doc.data(), id: doc.id };
};

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("database", {
  state: () => {
    return {
      data: [] as Pray[],
      users: [] as User[],
    };
  },
  actions: {
    async getListOfPray() {
      const prayList: Pray[] = [];

      try {
        const querySnapshot = await getDocs(collection(db, "prayers"));

        for (const rec of querySnapshot.docs) {
          const docData = rec.data();
          const owner = (await getRelatedDoc(docData.owner.path)) as User;

          prayList.push({
            archived: docData.archived,
            date: docData.date,
            description: docData.description,
            prayers: [],
            id: rec.id,
            owner,
          });
        }
        this.data = prayList;
      } catch (err) {
        console.error(err);
      }
    },
    async getListOfUsers() {
      const listOfUser: User[] = [];
      try {
        const querySnapshot = await getDocs(collection(db, "users"));

        for (const rec of querySnapshot.docs) {
          const databaseUser = rec.data();

          listOfUser.push({ id: rec.id, name: databaseUser.name });
        }
        this.users = listOfUser;
      } catch (err) {
        console.error(err);
      }
    },
    async addPray(owner: string, description: string) {
      try {
        await addDoc(collection(db, "prayers"), {
          archived: false,
          date: Timestamp.now(),
          description: description,
          prayers: [],
          owner: doc(db, "users/" + owner),
        });
      } catch (err) {
        console.error(err);
      }
    },
    async addUser(userName: string) {
      try {
        await addDoc(collection(db, "users"), { name: userName });
      } catch (err) {
        console.error(err);
      }
    },
    async removePray(prayID: string) {
      const resp = await deleteDoc(doc(db, `prayers/${prayID}`));
      console.log(resp);
    },
  },
});
