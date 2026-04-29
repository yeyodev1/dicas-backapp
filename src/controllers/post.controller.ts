import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import * as postService from '../services/post.service';

export async function getPublishedPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await postService.getPublishedPosts();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getAllPosts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const posts = await postService.getAllPosts(req.user!.userId, req.user!.accountType);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPostBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await postService.getPostBySlug(req.params.slug as string);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export async function createPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, excerpt, content, coverImage, tags, status } = req.body;
    if (!title || !excerpt || !content) {
      res.status(400).json({ message: 'Título, extracto y contenido requeridos' });
      return;
    }
    const post = await postService.createPost({ title, excerpt, content, coverImage, tags, status }, req.user!.userId);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await postService.updatePost(req.params.id as string, req.body, req.user!.userId, req.user!.accountType);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await postService.deletePost(req.params.id as string, req.user!.userId, req.user!.accountType);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function togglePublish(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await postService.togglePublish(req.params.id as string);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}
