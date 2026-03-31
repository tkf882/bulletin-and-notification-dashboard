// css definition in app.css
// import { useState } from 'react';

import type { tagFormat } from '../types/tagFormat.ts';

interface tagProps {
  tagEntry:tagFormat;
  tags:tagFormat[];
  setTags: (value:tagFormat[]) => void
}

export function Tag({tagEntry, tags, setTags}:tagProps) {
  // const [isSelected, setIsSelected] = useState(false);

  function handleTagToggle() {
    // setIsSelected(!isSelected);
    // tagEntry.selected = isSelected;

    let newTagList:tagFormat[] = tags.slice(); // not using structuredClone since a shallow copy is needed
    newTagList.forEach((tag) => {
      if (tagEntry.tag.tid === tag.tag.tid) {
        tag.selected = !tag.selected;
      }
    })

    setTags(newTagList);

  }

  return (
    <button className={tagEntry.selected ? 'tag-selected' : 'tag'} onClick={handleTagToggle}>{tagEntry.tag.tag_name}</button>
  )
}