<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts } from './recent-posts.data'
</script>

<template>
  <div v-if="posts.length" class="recent-post-list">
    <a v-for="post in posts" :key="post.url" class="recent-post-card" :href="withBase(post.url)">
      <span class="recent-post-card__meta">
        <span>{{ post.category }}</span>
        <time :datetime="post.date">{{ post.date }}</time>
      </span>
      <strong class="recent-post-card__title">
        {{ post.title }}
        <span aria-hidden="true">→</span>
      </strong>
      <span class="recent-post-card__excerpt">{{ post.excerpt }}</span>
    </a>
  </div>
</template>
