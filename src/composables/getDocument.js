import { projectFirestore } from "@/firebase/config";
import { ref, watchEffect } from "vue"

const getDocument = (collection = "game", id = "1") => {
    const error = ref(null)
    const document = ref(null)
    let documentRef = projectFirestore.collection(collection).doc(id)
    const unsub = documentRef.onSnapshot((doc) => {
        if (doc.data()) {
            document.value = { ...doc.data(), id: doc.id }
            error.value = null
        } else {
            error.value = "this document does not exist"
        }
    }, (err) => {
        console.log(err.message);
        error.value = "could not fetch data"
        document.value = null
    })

    watchEffect((onInvalidate) => {
        onInvalidate(() => {
            unsub()
        })
    })

    return { error, document }
}
export default getDocument