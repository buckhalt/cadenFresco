import { NextResponse, type NextRequest } from 'next/server';
import { searchParamsCache } from '~/app/dashboard/_components/ActivityFeed/SearchParams';
import { requireApiAuth } from '~/utils/auth';
import { prisma } from '~/utils/db';

export async function GET(request: NextRequest) {
  await requireApiAuth();

  const rawParams = request.nextUrl.searchParams.entries();
  const searchParams = searchParamsCache.parse(Object.fromEntries(rawParams));

  const { page, perPage, sort, sortField, filterParams } = searchParams;

  // Number of items to skip
  const offset = page > 0 ? (page - 1) * perPage : 0;

  // Generate the dynamic filter parameters for the database call from the
  // input filter params.
  const queryFilterParams = filterParams
    ? {
        OR: [
          ...filterParams.map(({ id, value }) => {
            const operator = Array.isArray(value) ? 'in' : 'contains';
            return {
              [id]: { [operator]: value },
            };
          }),
        ],
      }
    : {};

  // Transaction is used to ensure both queries are executed in a single transaction
  const [count, events] = await prisma.$transaction([
    prisma.events.count({
      where: {
        ...queryFilterParams,
      },
    }),
    prisma.events.findMany({
      take: perPage,
      skip: offset,
      orderBy: { [sortField]: sort },
      where: {
        ...queryFilterParams,
      },
    }),
  ]);

  const pageCount = Math.ceil(count / perPage);


  return NextResponse.json({ events, pageCount });
}