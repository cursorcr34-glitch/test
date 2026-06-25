import type { FastifyInstance } from 'fastify';
import { DISTRICTS } from '../types/index.js';

export async function districtRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request) => {
    const locale = (request.query as { locale?: 'AZ' | 'EN' | 'RU' }).locale ?? 'AZ';

    const counts = await fastify.prisma.property.groupBy({
      by: ['district'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });

    const districts = DISTRICTS.map((d) => {
      const count = counts.find((c) => c.district === d.id);
      const name = locale === 'EN' ? d.nameEn : locale === 'RU' ? d.nameRu : d.nameAz;

      return {
        id: d.id,
        slug: d.slug,
        name,
        nameAz: d.nameAz,
        nameEn: d.nameEn,
        nameRu: d.nameRu,
        city: d.city,
        activeListings: count?._count.id ?? 0,
      };
    });

    return { districts };
  });

  fastify.get('/:slug', async (request, reply) => {
    const slug = (request.params as { slug: string }).slug;
    const locale = (request.query as { locale?: 'AZ' | 'EN' | 'RU' }).locale ?? 'AZ';

    const district = DISTRICTS.find((d) => d.slug === slug);
    if (!district) {
      return reply.status(404).send({ error: 'District not found' });
    }

    const [activeListings, averagePrice] = await Promise.all([
      fastify.prisma.property.count({
        where: { district: district.id, status: 'ACTIVE' },
      }),
      fastify.prisma.property.aggregate({
        where: { district: district.id, status: 'ACTIVE' },
        _avg: { price: true },
      }),
    ]);

    const name = locale === 'EN' ? district.nameEn : locale === 'RU' ? district.nameRu : district.nameAz;

    return {
      district: {
        id: district.id,
        slug: district.slug,
        name,
        nameAz: district.nameAz,
        nameEn: district.nameEn,
        nameRu: district.nameRu,
        city: district.city,
        activeListings,
        averagePrice: averagePrice._avg.price ? Number(averagePrice._avg.price) : 0,
      },
    };
  });
}
