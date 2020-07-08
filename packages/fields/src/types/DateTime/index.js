import {
  DateTime,
  MongoDateTimeInterface,
  KnexDateTimeInterface,
  PrismaDateTimeInterface,
} from './Implementation';
import { importView } from '@keystonejs/build-field-types';

export default {
  type: 'DateTime',
  implementation: DateTime,
  views: {
    Controller: importView('./views/Controller'),
    Field: importView('./views/Field'),
    Filter: importView('./views/Filter'),
    Cell: importView('./views/Cell'),
  },
  adapters: {
    mongoose: MongoDateTimeInterface,
    knex: KnexDateTimeInterface,
    prisma: PrismaDateTimeInterface,
  },
};
