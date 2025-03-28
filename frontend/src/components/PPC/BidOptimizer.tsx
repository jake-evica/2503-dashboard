import React, { useState } from "react"
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Stack,
  Text
} from "@chakra-ui/react"
import { FiUpload, FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi"

const BidOptimizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [targetAcos, setTargetAcos] = useState(30)
  const [increaseSpendOnPromising, setIncreaseSpendOnPromising] = useState(true)
  const [showKeywordInfo, setShowKeywordInfo] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const showPromisingKeywordsInfo = () => {
    alert("Promising keywords are those with high conversion rates and positive ROI trends.")
  }

  const toggleKeywordInfo = () => {
    setShowKeywordInfo(!showKeywordInfo)
  }

  return (
    <Stack direction="column" gap={8}>
      <Box>
        <Heading as="h2" size="md" mb={4}>Amazon PPC Bid Optimization Tool</Heading>
        <Text color="gray.600" fontSize="lg">
          This tool helps you optimize your Amazon PPC bids based on performance metrics. Upload your PPC data and set your target ACOS to get bid recommendations.
        </Text>
      </Box>

      <Box py={4}>
        <Heading as="h3" size="sm" mb={5}>Upload PPC Data</Heading>
        <Box
          borderWidth="1px"
          borderRadius="md"
          borderStyle="dashed"
          borderColor="gray.300"
          p={10}
          bg="gray.50"
          cursor="pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Stack direction="column" gap={4} align="center">
            <Icon as={FiUpload} boxSize={8} color="purple.500" />
            <Text fontSize="lg" fontWeight="medium">Drag and drop file here</Text>
            <Text fontSize="md" color="gray.500">Limit 200MB per file • XLSX, XLS, CSV</Text>
            <Input
              type="file"
              id="file-upload"
              display="none"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
            />
            <Button variant="outline" colorScheme="purple" size="md" px={6} py={5} mt={2}>
              Browse files
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box py={4}>
        <Text fontWeight="medium" mb={4} fontSize="lg">Target ACOS (%)</Text>
        <Flex maxW="400px" align="center">
          <Input
            type="number"
            value={targetAcos}
            onChange={(e) => setTargetAcos(Number(e.target.value))}
            min={1}
            max={100}
            maxW="200px"
            size="lg"
          />
          <Button variant="ghost" size="lg" ml={4}>−</Button>
          <Button variant="ghost" size="lg">+</Button>
        </Flex>
      </Box>

      <Flex align="center" py={4}>
        <Box as="label" display="flex" alignItems="center">
          <input
            type="checkbox"
            checked={increaseSpendOnPromising}
            onChange={(e) => setIncreaseSpendOnPromising(e.target.checked)}
            style={{ marginRight: '12px', width: '18px', height: '18px' }}
          />
          <Text fontSize="lg">Increase spend on promising keywords</Text>
        </Box>
        <Box ml={2} cursor="pointer" onClick={showPromisingKeywordsInfo}>
          <Icon as={FiInfo} color="gray.400" boxSize={5} />
        </Box>
      </Flex>

      <Box py={4}>
        <Text fontWeight="medium" mb={4} fontSize="lg">What are promising keywords?</Text>
        <Button 
          variant="outline" 
          w="full" 
          justifyContent="space-between" 
          py={6} 
          px={5}
          onClick={toggleKeywordInfo}
          borderRadius="md"
        >
          <Text>Select criteria</Text>
          <Icon as={showKeywordInfo ? FiChevronUp : FiChevronDown} />
        </Button>
        
        {showKeywordInfo && (
          <Box 
            mt={2} 
            p={6} 
            borderWidth="1px" 
            borderRadius="md" 
            borderColor="gray.200"
            bg="white"
          >
            <Text fontSize="lg" fontWeight="medium" mb={4}>
              Promising Keywords are keywords that:
            </Text>
            
            <Box ml={4} mb={6}>
              <Flex align="flex-start" mb={3}>
                <Text mr={2}>•</Text>
                <Text>Have a high Click-Through Rate (CTR) above 0.3%</Text>
              </Flex>
              <Flex align="flex-start" mb={3}>
                <Text mr={2}>•</Text>
                <Text>Have not generated sales yet</Text>
              </Flex>
              <Flex align="flex-start" mb={3}>
                <Text mr={2}>•</Text>
                <Text>Have low spend relative to AOV (less than 10% of AOV)</Text>
              </Flex>
            </Box>
            
            <Box mb={4}>
              <Text fontWeight="medium" mb={2}>Example:</Text>
              <Text>
                A keyword with 100 impressions, 5 clicks (5% CTR), no sales, and $1.50 spend. If your AOV is $25, this keyword has only spent 6% of AOV but shows strong customer interest with its high CTR.
              </Text>
            </Box>
            
            <Text>
              By increasing bids on these keywords, you're giving them more visibility to potentially generate sales.
            </Text>
          </Box>
        )}
      </Box>
      
      {!file && (
        <Box p={5} borderRadius="md" bg="yellow.50" borderWidth="1px" borderColor="yellow.200">
          <Text color="yellow.800" fontSize="md">
            No PPC data files uploaded. Please upload a file using the uploader above.
          </Text>
        </Box>
      )}
      
      <Box p={5} borderRadius="md" bg="blue.50" borderWidth="1px" borderColor="blue.200" mb={10}>
        <Text color="blue.800" fontSize="md">
          This tool helps you optimize bids based on your PPC campaign performance data. Upload your Amazon advertising data to get started.
        </Text>
      </Box>
    </Stack>
  )
}

export default BidOptimizer 