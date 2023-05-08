import { Button, Flex } from '@chakra-ui/react';

export interface Props {
  onClick: () => void;
}
export const CreateAccommodationPricingButton = ({ onClick }: Props) => {
  return (
    <Flex alignItems={'center'} justifyContent={'center'} padding={'10px 0'}>
      <Button
        onClick={() => onClick()}
        w={'100%'}
        color={'white'}
        background={'green'}
      >
        Add pricing
      </Button>
    </Flex>
  );
};
