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

const colRef = collection(db, "categories");
const categories = ref([]);
const category = ref({
  category: "",
});
const editCategory = ref({
  category: "",
});
const loading = ref(false);
onMounted(() => {
  getCategories();
});
const getCategories = () => {
  loading.value = true;
  categories.value = [];
  getDocs(colRef).then((res) => {
    res.docs.forEach((doc) => {
      categories.value.push({ id: doc.id, ...doc.data() });
    });
    loading.value = false;
  });
};
const addCategory = () => {
  addDoc(colRef, category.value).then(() => {
    getCategories();
    const modal = Modal.getInstance(
      document.getElementById("addCategoryModal")
    );
    modal.hide();
  });
};
const editData = (d) => {
  editCategory.value = d;
};
const updateCategory = () => {
  const docRef = doc(db, "categories", editCategory.value.id);
  updateDoc(docRef, editCategory.value).then(() => {
    getCategories();
    const modal = Modal.getInstance(
      document.getElementById("editCategoryModal")
    );
    modal.hide();
  });
};
const deleteCategory = (id) => {
  const docRef = doc(db, "categories", id);
  deleteDoc(docRef).then((res) => {
    getCategories();
  });
};
</script>
<template>
  <div class="category">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <div class="d-flex align-items-center justify-content-between">
            <h3 class="fw-bold">Category Management</h3>
            <button
              class="btn btn-primary fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#addCategoryModal"
            >
              + Add Category
            </button>
          </div>
        </div>
        <div class="card-body">
          <table class="table table-bordered table-striped">
            <thead class="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Category Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr v-for="(cat, index) in categories" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ cat.category }}</td>
                <td>
                  <div
                    class="d-flex align-items-center justify-content-center gap-3"
                  >
                    <button
                      class="btn btn-primary px-2 py-0"
                      data-bs-toggle="modal"
                      data-bs-target="#editCategoryModal"
                      @click="editData(cat)"
                    >
                      <i class="bi bi-pencil-square fs-4"></i>
                    </button>
                    <button
                      class="btn btn-danger px-2 py-0"
                      @click="deleteCategory(cat.id)"
                    >
                      <i class="bi bi-trash3 fs-4"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td></td>
                <td class="text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Add Category Modal -->
    <div
      class="modal fade"
      id="addCategoryModal"
      tabindex="-1"
      aria-labelledby="addCategoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bold" id="addCategoryModalLabel">
              Add Category
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
              <label for="name" class="form-label fw-semibold"
                >Category Name</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="Please enter the category"
                v-model="category.category"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="addCategory">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div
      class="modal fade"
      id="editCategoryModal"
      tabindex="-1"
      aria-labelledby="editCategoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bold" id="editCategoryModalLabel">
              Edit Category
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
              <label for="category" class="form-label fw-semibold"
                >Category</label
              >
              <input
                type="text"
                class="form-control"
                id="category"
                placeholder="Please enter the category"
                v-model="editCategory.category"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="updateCategory"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
