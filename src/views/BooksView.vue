<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

const books = ref("");
const store = useStore();

onMounted(() => {
  books.value = store.state.books;
});
</script>
<template>
  <div class="home">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div>
            <div>
              <h2 class="fw-bold mb-4">Uploaded Books</h2>
            </div>
          </div>
          <div class="row">
            <div
              class="col-lg-3 col-md-4 col-sm-6 mb-3"
              v-for="(book, index) in books"
              :key="index"
            >
              <div class="card shadow">
                <div class="card-body">
                  <small class="fw-bold text-secondary">Title</small>
                  <h4 class="card-title mb-1">{{ book.title }}</h4>
                  <small class="fw-semibold text-secondary">Author</small>
                  <p class="fw-semibold mb-1">{{ book.author }}</p>
                  <small class="fw-semibold text-secondary">Categories</small>
                  <br />
                  <span
                    class="fw-semibold mb-1"
                    v-for="(cat, i) in book.categories"
                    :key="i"
                    >{{ i > 0 ? ", " : "" }}{{ cat }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>