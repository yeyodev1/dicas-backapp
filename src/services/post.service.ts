import models from '../models';
import { CustomError } from '../errors/customError.error';

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (await models.posts.findOne({ slug })) {
    slug = `${base}-${++n}`;
  }
  return slug;
}

export async function getPublishedPosts(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    models.posts.find({ status: 'published' })
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit),
    models.posts.countDocuments({ status: 'published' }),
  ]);
  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getAllPosts(userId: string, accountType: string) {
  const filter = accountType === 'admin' ? {} : { author: userId };
  return models.posts.find(filter)
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
}

export async function getPostBySlug(slug: string) {
  const post = await models.posts.findOne({ slug, status: 'published' }).populate('author', 'name');
  if (!post) throw new CustomError('Post no encontrado', 404);
  return post;
}

export async function createPost(
  data: { title: string; excerpt: string; content: string; coverImage?: string; tags?: string[]; status?: string },
  userId: string
) {
  const base = toSlug(data.title);
  const slug = await uniqueSlug(base);
  return models.posts.create({ ...data, slug, author: userId });
}

export async function updatePost(
  id: string,
  data: Partial<{ title: string; excerpt: string; content: string; coverImage: string; tags: string[]; status: string }>,
  userId: string,
  accountType: string
) {
  const post = await models.posts.findById(id);
  if (!post) throw new CustomError('Post no encontrado', 404);
  if (accountType !== 'admin' && post.author.toString() !== userId) {
    throw new CustomError('Sin permiso para editar este post', 403);
  }
  Object.assign(post, data);
  return post.save();
}

export async function deletePost(id: string, userId: string, accountType: string) {
  const post = await models.posts.findById(id);
  if (!post) throw new CustomError('Post no encontrado', 404);
  if (accountType !== 'admin' && post.author.toString() !== userId) {
    throw new CustomError('Sin permiso para eliminar este post', 403);
  }
  await post.deleteOne();
}

export async function togglePublish(id: string) {
  const post = await models.posts.findById(id);
  if (!post) throw new CustomError('Post no encontrado', 404);
  post.status = post.status === 'published' ? 'draft' : 'published';
  if (post.status === 'published' && !post.publishedAt) {
    post.publishedAt = new Date();
  }
  return post.save();
}
