import React from "react"
import { Box, Heading, Text, Stack } from "@chakra-ui/react"

const CampaignCreator: React.FC = () => {
  return (
    <Stack direction="column" gap={8}>
      <Box>
        <Heading as="h2" size="md" mb={4}>Campaign Creator</Heading>
        <Text color="gray.600" fontSize="lg">
          Create optimized Amazon PPC campaigns with automated targeting and bidding strategies.
        </Text>
      </Box>
      
      <Box p={6} borderRadius="md" bg="gray.50" borderWidth="1px" borderColor="gray.200">
        <Text color="gray.600" fontSize="md">
          The Campaign Creator feature is coming soon. This tool will help you build well-structured campaigns with optimal targeting settings and bidding strategies.
        </Text>
      </Box>
      
      <Box p={5} borderRadius="md" bg="blue.50" borderWidth="1px" borderColor="blue.200" mb={10}>
        <Text color="blue.800" fontSize="md">
          This tool helps you create campaigns that align with your advertising goals and budget constraints. Check back soon for this feature.
        </Text>
      </Box>
    </Stack>
  )
}

export default CampaignCreator 