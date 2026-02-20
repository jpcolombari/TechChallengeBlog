import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';

const mockPost = {
  title: 'Test Post',
  content: 'Test Content',
  author: 'Test Author',
  toObject: function () { return this; }
};

const createPostDto = {
  title: 'New Post',
  content: 'Content of new post',
  author: 'New Author',
};

describe('PostsService', () => {
  let service: PostsService;
  let model: Model<Post>;

  const mockQuery = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockPost]),
  };

  const mockCountQuery = {
    exec: jest.fn().mockResolvedValue(1),
  };

  const mockPostModel = {
    find: jest.fn().mockReturnValue(mockQuery),
    countDocuments: jest.fn().mockReturnValue(mockCountQuery),
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
    it('should return paginated posts', async () => {
      const result = await service.findAll();
      expect(result.data).toEqual([
        {
          ...mockPost,
          summary: mockPost.content.substring(0, 100),
        },
      ]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.lastPage).toBe(1);
      expect(model.find).toHaveBeenCalled();
      expect(model.countDocuments).toHaveBeenCalled();
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