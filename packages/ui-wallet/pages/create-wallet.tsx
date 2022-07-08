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
        <Stack>
          <h1>You can create your wallet or import your current one</h1>
          <div>
            <Button className="hover:bg-blue-800">Create your wallet</Button>
            <Button className="hover:bg-blue-800">Create your wallet</Button>
          </div>
          <div></div>
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
