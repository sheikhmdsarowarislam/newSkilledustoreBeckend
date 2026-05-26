import { ClientSession } from 'mongoose';
import Chapter, { IChapter } from './chapter.model';
import Lecture from '../lectures/lecture.model';


// --- READ Operations ---

export const findChapterById = (chapterId: string, session?: ClientSession): Promise<IChapter | null> => {
  return Chapter.findById(chapterId)
    .session(session || null)
    .lean()
    .exec() as unknown as Promise<IChapter | null>;
};

export const findChaptersByCourse = (courseId: string, session?: ClientSession): Promise<IChapter[]> => {
  return Chapter.find({ course: courseId })
    .sort({ order: 1 })
    .session(session || null)
    .lean()
    .exec() as unknown as Promise<IChapter[]>;
};


// --- WRITE Operations ---

export const createChapter = (data: Partial<IChapter>, session?: ClientSession): Promise<IChapter> => {
  return Chapter.create([data], { session: session || undefined, ordered: true }).then(res => {
    if (res.length === 0) {
      throw new Error("Repository failed to create chapter document.");
    }
    return res[0] as unknown as IChapter;
  });
};

export const updateChapterById = (
  chapterId: string,
  updateData: Partial<IChapter>,
  session?: ClientSession
): Promise<IChapter | null> => {
  return Chapter.findByIdAndUpdate(chapterId, updateData, {
    new: true,
    runValidators: true
  })
    .session(session || null)
    .lean()
    .exec() as unknown as Promise<IChapter | null>;
};

export const deleteChapterById = (chapterId: string, session?: ClientSession): Promise<IChapter | null> => {
  return Chapter.findByIdAndDelete(chapterId)
    .session(session || null)
    .lean()
    .exec() as unknown as Promise<IChapter | null>;
};


// --- CASCADING Operations ---

export const deleteChapterDependencies = async (chapterId: string, session: ClientSession): Promise<void> => {
  await Promise.all([
    Lecture.deleteMany({ chapter: chapterId }).session(session)
  ]);
};


// OPTIMIZATION: Get chapter count efficiently
export const getChapterCountByCourse = (courseId: string, session?: ClientSession): Promise<number> => {
  return Chapter.countDocuments({ course: courseId })
    .session(session || null)
    .exec();
};