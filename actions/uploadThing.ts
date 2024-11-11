'use server';

import { File } from 'node:buffer';
import { readFile, unlink } from 'node:fs/promises';
import { UTApi } from 'uploadthing/server';
import type {
  ArchiveResult,
  ExportReturn,
} from '~/lib/network-exporters/utils/types';
import { getAppSetting } from '~/queries/appSettings';
import { requireApiAuth } from '~/utils/auth';
import { ensureError } from '~/utils/ensureError';

export const deleteZipFromUploadThing = async (key: string) => {
  await requireApiAuth();

  const UPLOADTHING_TOKEN = await getAppSetting('uploadThingToken');


  const utapi = new UTApi({
    token: UPLOADTHING_TOKEN,
  });

  const deleteResponse = await utapi.deleteFiles(key);

  if (!deleteResponse.success) {
    throw new Error('Failed to delete the zip file from UploadThing');
  }
};

export const uploadZipToUploadThing = async (
  results: ArchiveResult,
): Promise<ExportReturn> => {
  const { path: zipLocation, completed, rejected } = results;

  try {
    const fileName = zipLocation.split('/').pop()?.split('.').shift() ?? 'file';
    const zipBuffer = await readFile(zipLocation);
    const zipFile = new File([zipBuffer], `${fileName}.zip`, {
      type: 'application/zip',
    });

    const UPLOADTHING_TOKEN = await getAppSetting('uploadThingToken');

    const utapi = new UTApi({
      token: UPLOADTHING_TOKEN,
    });

    const { data, error } = await utapi.uploadFiles(zipFile);

    if (data) {
      void unlink(zipLocation); // Delete the zip file after successful upload
      return {
        zipUrl: data.url,
        zipKey: data.key,
        status: rejected.length ? 'partial' : 'success',
        error: rejected.length ? 'Some exports failed' : null,
        failedExports: rejected,
        successfulExports: completed,
      };
    }

    return {
      status: 'error',
      error: error.message,
    };
  } catch (error) {
    const e = ensureError(error);
    return {
      status: 'error',
      error: e.message,
    };
  }
};
