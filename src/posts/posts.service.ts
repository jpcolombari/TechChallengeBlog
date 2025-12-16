import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.postModel.create(createPostDto);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.postModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments().exec(),
    ]);

    const postsWithSummary = results.map((post) => {
      const postObj = post.toObject();
      return {
        ...postObj,
        summary: postObj.content.length > 100 
          ? postObj.content.substring(0, 100) + '...' 
          : postObj.content,
      };
    });

    return {
      data: postsWithSummary,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post com o ID "${id}" não encontrado.`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post com o ID "${id}" não encontrado.`);
    }
    return updatedPost;
  }

  async remove(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    if (!deletedPost) {
      throw new NotFoundException(`Post com o ID "${id}" não encontrado.`);
    }
    return deletedPost;
  }

  private escapeRegex(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  async search(term: string): Promise<Post[]> {
    const regex = new RegExp(this.escapeRegex(term), 'i');

    return this.postModel
      .find({
        $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
      })
      .exec();
  }
}