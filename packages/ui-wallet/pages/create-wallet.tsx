import { Box, Button, Center, Stack } from '@skiawallet/ui-components';
import Grid from 'packages/ui-components/src/lib/layout/grid';
import { useState } from 'react';

export default function Login() {
  const [showImportSection, setShowImportSection] = useState(false);
  const [showAutocreationSection, setShowAutocreationSection] = useState(false);
  // const [isCreatingSeedPhrase, setCreatingSeedPhrase] = useState(false);

  return (
    <div className="h-full">
      <Center andText={true}>
        <Stack >
          <h1>Create Your Wallet</h1>
          <Grid>
            <div>
              <Button className="hover:bg-blue-800">Create your wallet</Button>
            </div>
            <div>
              <Button className="hover:bg-blue-800">Create your wallet</Button>
            </div>
          </Grid>
        </Stack>
      </Center>
      {showAutocreationSection ? (
        <Box className="max">
          <Stack>Hola</Stack>
        </Box>
      ) : (
        <></>
      )}
    </div>
  );
}
