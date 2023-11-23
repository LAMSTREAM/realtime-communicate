'use client'

import { Loading } from '@/components/stateindicate/loading';
import { Warning } from '@/components/stateindicate/error';
import { Success } from '@/components/stateindicate/success';
import { TypographyP } from '@/components/typography/Typography';

type StateModalState = 'Loading' | 'Failed' | 'Succeed' | '';
type StateModalDesc = string | undefined;

interface StateModalProps {
  data: {
    state: StateModalState;
    desc: StateModalDesc;
  }
}

export default function StateModal({data}: StateModalProps) {
  const { state, desc } = data;

  const content = (
    <TypographyP className={`text-center`}>{desc || ''}</TypographyP>
  );

  const className = `z-[100] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`

  switch (state) {
    case 'Loading':
      return (
        <Loading className={className}>
          {content}
        </Loading>
      );
    case 'Failed':
      return (
        <Warning className={className}>
          {content}
        </Warning>
      );
    case 'Succeed':
      return (
        <Success className={className}>
          {content}
        </Success>
      );
    case '':
    default:
      return null;
  }
}
