
import { field as name } from './name/name'
import { field as steamRating } from './steamRating/steamRating'
import { field as opencriticRating } from './opencriticRating/opencriticRating'
import { field as releaseDate } from './releaseDate'
import { field as genre } from './genre'
import { field as timeType } from './timeType'
import { field as tags } from './tags'
import { field as review } from './review'
import { field as translations } from './translations/translations'
import { field as status } from './status'
import { field as developer } from './developer'
import { field as publisher } from './publisher'
import { field as platforms } from './platforms/platforms'

export default [
  name,
  releaseDate,
  genre,
  timeType,
  tags,
  review,
  steamRating,
  opencriticRating,
  translations,
  status,
  developer,
  publisher,
  platforms
]
