// css definition in app.css
import { useState } from 'react';

import type { tagFormat } from '../types/tagFormat.ts';

interface tagProps {
  tagEntry:tagFormat;
}

export function Tag({tagEntry}:tagProps) {
  const [isSelected, setIsSelected] = useState(false);

  function handleTagToggle() {
    setIsSelected(!isSelected);
    tagEntry.selected = isSelected;
  }

  return (
    <button className={isSelected ? 'tag-selected' : 'tag'} onClick={handleTagToggle}>{tagEntry.tag.tag_name}</button>
  )
}