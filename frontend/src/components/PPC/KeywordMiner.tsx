import React from "react"
import { Box, Heading, Text, Stack } from "@chakra-ui/react"

const KeywordMiner: React.FC = () => {
  return (
    <Stack direction="column" gap={8}>
      <Box>
        <Heading as="h2" size="md" mb={4}>Keyword Miner</Heading>
        <Text color="gray.600" fontSize="lg">
          Discover profitable keywords for your Amazon PPC campaigns with our AI-powered keyword mining tool.
        </Text>
      </Box>
      
      <Box p={6} borderRadius="md" bg="gray.50" borderWidth="1px" borderColor="gray.200">
        <Text color="gray.600" fontSize="md">
          The Keyword Miner feature is coming soon. This tool will help you identify high-potential keywords based on search volume, competition, and relevance to your products.
        </Text>
      </Box>
      
      <Box p={5} borderRadius="md" bg="blue.50" borderWidth="1px" borderColor="blue.200" mb={10}>
        <Text color="blue.800" fontSize="md">
          This tool helps you discover new keywords based on your product data and competitor analysis. Upload your product information to get started.
        </Text>
      </Box>
    </Stack>
  )
}

export default KeywordMiner 