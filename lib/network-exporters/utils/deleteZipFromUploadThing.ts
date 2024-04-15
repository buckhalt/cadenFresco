// We need to delete the exported data from uploadthing after the user has downloaded it.
// This is to ensure that we are not storing any sensitive data on UploadThing for longer than necessary.

import { utapi } from '~/app/api/uploadthing/core';

export const deleteZipFromUploadThing = async (key: string) => {
  const deleteResponse = await utapi.deleteFiles(key);

  if (!deleteResponse.success) {
    throw new Error('Failed to delete files from uploadthing');
  }
};
