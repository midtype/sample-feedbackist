import { getJWT } from './jwt';

export const hexToRGB = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
};

export const categoryBackground = (category: ICategory) => {
  const { r, g, b } = hexToRGB(category.hex);
  return `rgba(${r},${g},${b},.1)`;
};

export const uploadFile = async (file: Blob) => {
  const body = new FormData();
  body.append('asset', file);
  const asset = await fetch(
    `${process.env.REACT_APP_MIDTYPE_API || 'https://api.midtype.com'}/upload`,
    {
      method: 'POST',
      body,
      headers: { Authorization: `Bearer ${getJWT()}` }
    }
  ).then(res => res.json());
  return asset.asset_id;
};
