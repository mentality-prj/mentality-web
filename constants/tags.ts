import { TagProperties } from '@/types/tags'

export const tagproperties: TagProperties[] = [
  {
    key: 'add-tag-key',
    name: 'key',
    label: 'Add tag key:',
    description: 'Add a unique key for the new tag. Use Snake Case?: new_tag_name',
  },
  {
    key: 'add-tag-uk',
    name: 'uk',
    label: 'Ukrainian:',
    description: 'Add the text for a new tag in Ukrainian. This can be a word or phrase.',
  },
  {
    key: 'add-tag-en',
    name: 'en',
    label: 'English:',
    description: 'Add the text for the new tag in English. This can be a word or phrase.',
  },
  {
    key: 'add-tag-pl',
    name: 'pl',
    label: 'Polish:',
    description: 'Add the text for the new tag in Polish. This can be a word or phrase.',
  },
]
