---
layout: page
title: Library
---

<script setup>
import { computed } from 'vue'
import { data as allPosts } from './blogs.data'

const posts = computed(() => {
	return allPosts.filter((post) =>
		post.tags.some((tag) => {
			const t = String(tag).trim().toLowerCase()
			return t === 'the libary' || t === 'the library' || t === 'library' || t === 'libary'
		})
	)
})
</script>

# Library 文章集合

这里按标签 `The Libary` 自动展示文章。

<p>共加载 {{ allPosts.length }} 篇文章，匹配 {{ posts.length }} 篇</p>

<div v-if="posts.length" class="tag-cards">
	<a v-for="post in posts" :key="post.url" :href="post.url" class="VPFeature tag-card">
		<article class="box">
			<h2 class="title">{{ post.title }}</h2>
			<p class="details">{{ post.date || '未设置日期（已自动读取）' }}</p>
			<div class="link-text">
				<p class="link-text-value">阅读文章 <span class="vpi-arrow-right link-text-icon" /></p>
			</div>
		</article>
	</a>
</div>

<p v-else>当前没有带有 The Libary 标签的文章。</p>

<style scoped>
.tag-cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 16px;
	margin-top: 20px;
}

.tag-card {
	text-decoration: none;
}
</style>
