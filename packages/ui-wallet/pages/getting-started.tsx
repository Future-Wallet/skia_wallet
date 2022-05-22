import { AccountRepositoryPortis } from '@skiawallet/repositories';
import { Button, Center, Stack } from '@skiawallet/ui-components';

export default function GettingStarted() {
  function openPortis() {
    // AccountRepositoryPortis;
  }
  return (
    <Stack>
      <Center>
        <h1>Getting started with the wallet</h1>
      </Center>
      <Button onClick={openPortis}>Signin wallet</Button>
    </Stack>
  );
}
