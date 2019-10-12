import React from 'react';
import styled from 'styled-components';

import { categoryBackground } from '../../utils';

interface ICategoryEmojiProps {
  category: ICategory;
  diameter: string;
  font: string;
}

const Styled = styled.div`
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryEmoji: React.FC<ICategoryEmojiProps> = props => {
  const { category, diameter, font } = props;
  const style = {
    background: categoryBackground(category),
    height: diameter,
    width: diameter,
    fontSize: font
  };
  return <Styled style={style}>{category.emoji}</Styled>;
};

export default CategoryEmoji;
