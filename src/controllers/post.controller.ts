import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import * as postService from '../services/post.service';

export async function getPublishedPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await postService.getPublishedPosts(page, limit);
    
    res.status(200).send({
      message: "Published posts retrieved successfully.",
      ...result
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function getAllPosts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const posts = await postService.getAllPosts(req.user!.userId, req.user!.accountType);
    
    res.status(200).send({
      message: "All posts retrieved successfully.",
      posts
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function getPostBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await postService.getPostBySlug(req.params.slug as string);
    
    res.status(200).send({
      message: "Post retrieved successfully.",
      post
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function createPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, excerpt, content, coverImage, tags, status } = req.body;
    if (!title || !excerpt || !content) {
      res.status(400).send({ message: "Title, excerpt and content are required." });
      return;
    }
    const post = await postService.createPost({ title, excerpt, content, coverImage, tags, status }, req.user!.userId);
    
    res.status(201).send({
      message: "Post created successfully.",
      post
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await postService.updatePost(req.params.id as string, req.body, req.user!.userId, req.user!.accountType);
    
    res.status(200).send({
      message: "Post updated successfully.",
      post
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await postService.deletePost(req.params.id as string, req.user!.userId, req.user!.accountType);
    
    res.status(200).send({
      message: "Post deleted successfully."
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function togglePublish(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await postService.togglePublish(req.params.id as string);
    
    res.status(200).send({
      message: "Post publish status toggled successfully.",
      post
    });
    return;
  } catch (error) {
    next(error);
  }
}
