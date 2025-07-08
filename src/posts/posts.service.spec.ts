import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';

const mockPost = {
  title: 'Test Post',
  content: 'Test Content',
  author: 'Test Author',
};

const createPostDto = {
  title: 'New Post',
  content: 'Content of new post',
  author: 'New Author',
};

describe('PostsService', () => {
  let service: PostsService;
  let model: Model<Post>;

  const mockPostModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockPost]),
    }),
    create: jest.fn().mockResolvedValue(createPostDto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get<Model<Post>>(getModelToken(Post.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = await service.findAll();
      expect(posts).toEqual([mockPost]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a post', async () => {
      const post = await service.create(createPostDto);
      expect(post).toEqual(createPostDto);
      expect(model.create).toHaveBeenCalledWith(createPostDto);
    });
  });
});