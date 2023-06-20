import { findAllMaps } from '../api/findAllMaps';
import MapCard from '../components/MapCard';
import { MapSearchParameters } from '@/bindings/definitions';
import SimpleButton from '@/components/Button/SimpleButton';
import InfoMessage, { InfoMessageType } from '@/components/Card/InfoMessage';
import PageTitle from '@/components/Header/PageTitle';
import Footer from '@/components/Layout/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function MapOverview() {
  const initialMessage = {
    isSuccess: false,
    message: '',
  };

  const { user } = useSafeAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['maps']);
  const [infoMessage, setInfoMessage] = useState(initialMessage);

  const searchParams: MapSearchParameters = {
    owner_id: user?.profile.sub,
  };

  const { data } = useInfiniteQuery({
    queryKey: ['maps', searchParams] as const,
    queryFn: ({ pageParam = 1, queryKey: [, params] }) => findAllMaps(pageParam, params),
    getNextPageParam: (lastPage) => lastPage.page + 1,
    staleTime: 0,
  });

  const maps = data?.pages.flatMap((page) => page.results) ?? [];
  const mapList = maps.map((map) => <MapCard key={map.id} map={map} />);

  const infoMessageContainer = (
    <InfoMessage
      message={infoMessage.message}
      type={infoMessage.isSuccess ? InfoMessageType.success : InfoMessageType.failure}
      onClose={() => setInfoMessage({ ...infoMessage, message: '' })}
    />
  );

  return (
    <Suspense>
      <PageLayout>
        {infoMessage.message !== '' && infoMessageContainer}
        <PageTitle title={t('maps:overview.page_title')} />
        <SimpleButton
          onClick={() => navigate('/maps/create')}
          className="mb-8 max-w-[240px] grow"
          title={t('maps:overview.create_button_title')}
        >
          {t('maps:overview.create_button')}
        </SimpleButton>
        <section className="mb-12">{mapList}</section>
        <Footer />
      </PageLayout>
    </Suspense>
  );
}
