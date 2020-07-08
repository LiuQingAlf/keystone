import {
  SlugImplementation,
  MongoSlugInterface,
  KnexSlugInterface,
  PrismaSlugInterface,
} from './Implementation';
import { importView } from '@keystonejs/build-field-types';

const Slug = {
  type: 'Slug',
  implementation: SlugImplementation,
  views: {
    Controller: importView('../Text/views/Controller'),
    Field: importView('../Text/views/Field'),
    Filter: importView('../Text/views/Filter'),
  },
  adapters: {
    knex: KnexSlugInterface,
    mongoose: MongoSlugInterface,
    prisma: PrismaSlugInterface,
  },
};

export default Slug;
