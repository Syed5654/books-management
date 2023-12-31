<script setup>
import { onMounted, ref, watch } from "vue";
import db from "../firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore/lite";
import { Modal } from "bootstrap";
import { useStore } from "vuex";

const colRef = collection(db, "books");
const categoryColRef = collection(db, "categories");
const books = ref([]);
const categories = ref([]);
const data = ref({
  title: "",
  author: "",
  categories: [],
});
const editBook = ref({
  title: "",
  author: "",
  categories: [],
});
const loading = ref(false);
const store = useStore();
const error = ref('')

onMounted(() => {
  getBooks();
  getCategories();
});
const getBooks = () => {
  loading.value = true;
  books.value = [];
  getDocs(colRef).then((res) => {
    res.docs.forEach((doc) => {
      books.value.push({ id: doc.id, ...doc.data() });
    });
    loading.value = false;
    store.commit('setBooks', books.value)
  });
};

const getCategories = () => {
  categories.value = [];
  getDocs(categoryColRef).then((res) => {
    res.docs.forEach((doc) => {
      categories.value.push(doc.data());
    });
  });
};
const addBook = () => {
  loading.value = true;
  addDoc(colRef, data.value).then(() => {
    getBooks();
    const modal = Modal.getInstance(document.getElementById("addBookModal"));
    modal.hide();
    loading.value = false
  });
};
const editData = (d) => {
  editBook.value = d;
};
const updateData = () => {
  loading.value = true
  const docRef = doc(db, "books", editBook.value.id);
  updateDoc(docRef, editBook.value).then(() => {
    getBooks();
    const modal = Modal.getInstance(document.getElementById("editBookModal"));
    modal.hide();
    loading.value = false
  });
};
const deleteBook = (id) => {
  const docRef = doc(db, "books", id);
  deleteDoc(docRef).then((res) => {
    getBooks();
  });
};
</script>

<template>
  <div class="dashboard">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <div class="d-flex align-items-center justify-content-between">
            <h3 class="fw-bold">Books Management</h3>
            <button
              class="btn btn-primary fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#addBookModal"
            >
              + Add Book
            </button>
          </div>
        </div>
        <div class="card-body overflow-auto">
          <table class="table table-bordered table-striped">
            <thead class="table-dark">
              <tr>
                <th scope="col" class="col-1">#</th>
                <th scope="col">Book Title</th>
                <th scope="col">Author Name</th>
                <th scope="col">Categories</th>
                <th scope="col" class="col-2">Actions</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(book, index) in books" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>
                  <span v-for="(cat, i) in book.categories" :key="i">
                    {{ i > 0 ? ", " : "" }}{{ cat }}
                  </span>
                </td>
                <td>
                  <div
                    class="d-flex align-items-center justify-content-center gap-3"
                  >
                    <button
                      class="btn btn-primary px-2 py-0"
                      data-bs-toggle="modal"
                      data-bs-target="#editBookModal"
                      @click="editData(book)"
                    >
                      <i class="bi bi-pencil-square fs-5"></i>
                    </button>
                    <button
                      class="btn btn-danger px-2 py-0"
                      @click="deleteBook(book.id)"
                    >
                      <i class="bi bi-trash3 fs-5"></i>
                    </button>
                    <router-link to="/books" class="btn btn-primary px-2 py-0"><i class="bi bi-eye fs-5"></i></router-link>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td class="col-1"></td>
                <td></td>
                <td class="text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
                <td></td>
                <td class="col-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Add Book Modal -->
    <div
      class="modal fade"
      id="addBookModal"
      tabindex="-1"
      aria-labelledby="addBookModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bold" id="addBookModalLabel">
              Add Book
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="title" class="form-label fw-semibold"
                >Book Title</label
              >
              <input
                type="text"
                class="form-control"
                id="title"
                placeholder="Please enter the book title"
                v-model="data.title"
              />
            </div>
            <div class="mb-3">
              <label for="author" class="form-label fw-semibold"
                >Author Name</label
              >
              <input
                type="text"
                class="form-control"
                id="author"
                placeholder="Please enter the author name"
                v-model="data.author"
              />
            </div>
            <div>
              <label class="form-label fw-semibold"
                >Please Select Category</label
              >
              <div
                class="form-check"
                v-for="(cat, index) in categories"
                :key="index"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="cat.category"
                  :id="cat.category"
                  v-model="data.categories"
                />
                <label
                  class="form-check-label text-capitalize"
                  :for="cat.category"
                >
                  {{ cat.category }}
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="addBook" :disabled="loading">
              {{loading? 'Please Wait...' : 'Save changes'}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Book Modal -->
    <div
      class="modal fade"
      id="editBookModal"
      tabindex="-1"
      aria-labelledby="editBookModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bold" id="editBookModalLabel">
              Edit Book
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="title" class="form-label fw-semibold"
                >Book Title</label
              >
              <input
                type="text"
                class="form-control"
                id="title"
                placeholder="Please enter the book title"
                v-model="editBook.title"
              />
            </div>
            <div class="mb-3">
              <label for="author" class="form-label fw-semibold"
                >Author Name</label
              >
              <input
                type="text"
                class="form-control"
                id="author"
                placeholder="Please enter the author name"
                v-model="editBook.author"
              />
            </div>
            <div>
              <label class="form-label fw-semibold">Category</label>
              <div
                class="form-check"
                v-for="(cat, index) in categories"
                :key="index"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="cat.category"
                  :id="cat.category"
                  v-model="editBook.categories"
                />
                <label
                  class="form-check-label text-capitalize"
                  :for="cat.category"
                >
                  {{ cat.category }}
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="updateData" :disabled="loading">
              {{loading? 'Please Wait...' : 'Update'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>