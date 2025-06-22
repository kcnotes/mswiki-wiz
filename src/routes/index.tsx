import { Stack, Text, Title, Button, Center } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { open } from '@tauri-apps/plugin-dialog'
import { WzReaderService } from '../services/wz_reader_service'
import React from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  async function selectBaseWz() {
    setLoading(true)
    const file = await open({
      multiple: false,
      directory: false,
      filter: [{ name: 'Base', extensions: ['wz'] }],
    })
    if (file == null) {
      return setLoading(false)
    }
    try {
      const version = await WzReaderService.init({ path: file });
      console.log(version);
    } catch (e) {
      return setLoading(false)
    }
    setLoading(true)
    navigate({ to: '/home' })
  }

  return (
    <Center h="100vh">
      <Stack gap="sm" align="center">
        <Title order={2}>MapleStory Wiki: Wiz</Title>
        <Text>Find your MapleStory folder and select Base.wz to begin.</Text>
        <Text size="xs">
          Usually this is is at &lt;maplestory
          folder&gt;/appdata/Data/Base/Base.wz
        </Text>
        <Button onClick={selectBaseWz} loading={loading} disabled={loading}>
          Select Base.wz
        </Button>
      </Stack>
    </Center>
  )
}
