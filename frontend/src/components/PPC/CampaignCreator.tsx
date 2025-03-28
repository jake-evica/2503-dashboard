import React, { useState } from "react"
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import { FiX, FiInfo } from "react-icons/fi"

const CampaignCreator: React.FC = () => {
  const [campaigns, setCampaigns] = useState(1)
  const [targetingType, setTargetingType] = useState("Automatic")
  const [startingBid, setStartingBid] = useState(0.75)
  const [selectedTargetingTypes, setSelectedTargetingTypes] = useState(["close match"])
  const [includeThisCampaign, setIncludeThisCampaign] = useState(true)

  const decreaseBid = () => {
    if (startingBid > 0.1) {
      setStartingBid(parseFloat((startingBid - 0.01).toFixed(2)))
    }
  }

  const increaseBid = () => {
    setStartingBid(parseFloat((startingBid + 0.01).toFixed(2)))
  }

  const handleTargetingTypeChange = (type: string) => {
    if (selectedTargetingTypes.includes(type)) {
      setSelectedTargetingTypes(selectedTargetingTypes.filter(t => t !== type))
    } else {
      setSelectedTargetingTypes([...selectedTargetingTypes, type])
    }
  }

  // Average CPC for recommendation (normally this would come from API/data)
  const averageCpc = 0.67

  return (
    <Stack direction="column" gap={10} maxW="1200px" mx="auto">
      <Box>
        <Heading as="h2" size="md" mb={4}>Create Campaign</Heading>
        <Text color="gray.600" fontSize="lg">
          Create up to 10 campaigns at once
        </Text>
        <Text color="gray.600" fontSize="md" mt={2}>
          Fill in the details for each campaign below
        </Text>
      </Box>
      
      <Box bg="white" borderRadius="lg" boxShadow="md" p={8}>
        <Box as="button" 
          borderBottom="2px solid" 
          borderColor="purple.500" 
          color="purple.500" 
          fontWeight="medium" 
          pb={3} 
          mb={8}
          fontSize="lg"
        >
          Campaign 1
        </Box>
        
        <Box mb={8}>
          <Text fontSize="md" mb={3}>SKU</Text>
          <Input
            placeholder="Enter SKU"
            size="lg"
          />
        </Box>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={8} mb={8}>
          <GridItem>
            <Text fontSize="md" mb={3}>Product Identifier</Text>
            <Input
              placeholder="Enter product identifier"
              size="lg"
            />
          </GridItem>
          
          <GridItem>
            <Text fontSize="md" mb={3}>Starting Bid</Text>
            <Flex align="center">
              <Input
                type="number"
                value={startingBid}
                onChange={(e) => setStartingBid(Number(e.target.value))}
                min={0.1}
                step={0.01}
                size="lg"
                width="160px"
              />
              <Button variant="ghost" size="lg" ml={2} onClick={decreaseBid}>−</Button>
              <Button variant="ghost" size="lg" onClick={increaseBid}>+</Button>
              <Box 
                display="inline-flex" 
                alignItems="center" 
                ml={3} 
                cursor="help" 
                title="Recommended starting bid based on average CPC"
              >
                <FiInfo size={18} color="#718096" />
              </Box>
            </Flex>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Start with your average Cost-per-click (CPC)
            </Text>
          </GridItem>
        </Grid>
        
        <Box mb={8}>
          <Text fontSize="md" mb={3}>Campaign Targeting Type</Text>
          <Flex gap={8} mt={3}>
            <Flex align="center">
              <input
                type="radio"
                id="automatic"
                name="targetingType"
                value="Automatic"
                checked={targetingType === "Automatic"}
                onChange={() => setTargetingType("Automatic")}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              <label 
                htmlFor="automatic" 
                style={{ 
                  cursor: 'pointer', 
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              >
                Automatic
              </label>
            </Flex>
            <Flex align="center">
              <input
                type="radio"
                id="manual"
                name="targetingType"
                value="Manual"
                checked={targetingType === "Manual"}
                onChange={() => setTargetingType("Manual")}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              <label 
                htmlFor="manual" 
                style={{ 
                  cursor: 'pointer', 
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              >
                Manual
              </label>
            </Flex>
          </Flex>
        </Box>
        
        <Box mb={8}>
          <Heading as="h3" size="sm" mb={4}>Auto-targeting Options</Heading>
          <Box mb={5}>
            <Text fontSize="md" mb={3}>Targeting Types</Text>
            <Flex align="center" mb={3}>
              <Box 
                as="span" 
                bg="purple.100" 
                color="purple.700" 
                px={3} 
                py={1} 
                borderRadius="md" 
                fontSize="sm"
                display="inline-flex"
                alignItems="center"
              >
                close match
                <Button 
                  variant="ghost" 
                  ml={1} 
                  height="auto" 
                  minWidth="auto" 
                  lineHeight="1"
                  fontWeight="bold"
                  fontSize="md"
                  color="gray.500"
                  p={0}
                  _hover={{ color: "gray.700" }}
                >
                  ×
                </Button>
              </Box>
            </Flex>
            <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3}>
              <Flex justify="space-between" align="center">
                <Box as="span" fontSize="sm">Select targeting types...</Box>
                <Box as="span" transform="rotate(90deg)">▸</Box>
              </Flex>
            </Box>
          </Box>
          
          <Flex align="center">
            <input
              type="checkbox"
              id="includeCampaign"
              checked={includeThisCampaign}
              onChange={(e) => setIncludeThisCampaign(e.target.checked)}
              style={{ marginRight: '10px', width: '18px', height: '18px' }}
            />
            <label 
              htmlFor="includeCampaign" 
              style={{ 
                cursor: 'pointer', 
                fontFamily: 'inherit',
                fontSize: 'inherit'
              }}
            >
              Include this campaign
            </label>
          </Flex>
        </Box>
      </Box>
      
      <Box>
        <Button colorScheme="purple" mb={5} py={6} px={8} fontSize="md">
          Add New Campaign
        </Button>
      </Box>
      
      <Box 
        bg="linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)" 
        borderRadius="md" 
        p={6}
        color="white"
        fontWeight="medium"
        textAlign="center"
        cursor="pointer"
        fontSize="lg"
        _hover={{ opacity: 0.9 }}
      >
        Generate Campaigns
      </Box>
    </Stack>
  )
}

export default CampaignCreator 