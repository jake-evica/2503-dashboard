import {
  Box,
  Link as ChakraLink,
  Flex,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import type React from "react"
import { useState } from "react"
import { FiDownload, FiInfo, FiUpload } from "react-icons/fi"
import { Button } from "../../components/ui/button"

/*
type OptimizationResult = {
  data: any[];
  columns: string[];
  summary: {
    total_rows: number;
    updates_recommended: number;
    avg_change: number;
  };
};
*/

const BidOptimizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [targetAcos, setTargetAcos] = useState(30)
  const [increaseSpendOnPromising, setIncreaseSpendOnPromising] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [downloadId, setDownloadId] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setSuccessMessage(null)
      setDownloadId(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError(null)
      setSuccessMessage(null)
      setDownloadId(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const showPromisingKeywordsInfo = () => {
    alert(
      "When checked, the tool may increase bids slightly for keywords with low spend, zero sales, but good Click-Through Rates (CTR >= 0.3%) and low % of AOV (<= 10%), potentially capturing missed opportunities.",
    )
  }

  const processBidOptimization = async () => {
    if (!file) {
      setError("Please upload a file first")
      setSuccessMessage(null)
      setDownloadId(null)
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)
    setDownloadId(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("target_acos", targetAcos.toString())
      formData.append("increase_spend", increaseSpendOnPromising.toString())

      // Use the direct backend URL instead of relying on the Vite proxy
      const apiUrl = "http://localhost:8000/api/v1/ppc/upload"

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        // Store the response status for error reporting
        const statusText = response.statusText || `Error ${response.status}`

        // Try to get error details as JSON, but prepare for failure
        let errorDetail = `Request failed: ${statusText}`

        // Clone the response before reading its body
        const responseClone = response.clone()

        try {
          const errorData = await response.json()
          errorDetail = errorData.detail || errorDetail
        } catch (jsonError) {
          // If JSON parsing fails, try to get text instead, using the cloned response
          try {
            const textResponse = await responseClone.text()
            if (textResponse) {
              errorDetail = textResponse
            }
          } catch (textError) {
            // If both methods fail, just use the status
            console.error("Failed to read error response", textError)
          }
        }

        throw new Error(errorDetail)
      }

      const data = await response.json()
      if (data.download_id) {
        setDownloadId(data.download_id)
        setSuccessMessage(data.message || "File processed successfully!")
      } else {
        throw new Error("Processing response missing download ID.")
      }
    } catch (err: any) {
      const message =
        err.message || "An unexpected error occurred during processing."
      setError(message)
      setDownloadId(null)
      console.error("Optimization failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const decreaseTargetAcos = () => {
    if (targetAcos > 0) {
      setTargetAcos(targetAcos - 1)
    }
  }

  const increaseTargetAcos = () => {
    setTargetAcos(targetAcos + 1)
  }

  return (
    <Stack direction="column" gap={8}>
      <Box>
        <Heading as="h2" size="md" mb={4}>
          Amazon PPC Bid Optimization Tool
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Upload your PPC data (.xlsx, Sheet 1) and optionally include ASIN
          Average Order Value data in Sheet 2. Set your Target ACOS and
          preferences to generate an optimized bid file.
        </Text>
      </Box>

      <Box py={4}>
        <Heading as="h3" size="sm" mb={5}>
          Upload PPC Data File
        </Heading>
        <Box
          borderWidth="1px"
          borderRadius="md"
          borderStyle="dashed"
          borderColor={error ? "red.300" : file ? "green.300" : "gray.300"}
          p={10}
          bg={error ? "red.50" : file ? "green.50" : "gray.50"}
          cursor={loading ? "not-allowed" : "pointer"}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() =>
            !loading && document.getElementById("file-upload")?.click()
          }
          textAlign="center"
          transition="background-color 0.2s ease"
          opacity={loading ? 0.7 : 1}
        >
          <Stack direction="column" gap={4} align="center">
            <Icon as={FiUpload} boxSize={8} color="purple.500" />
            <Text fontSize="lg" fontWeight="medium">
              Drag & drop XLSX file here
            </Text>
            <Text fontSize="md" color="gray.500">
              (Requires Sheet 1 with PPC data, Sheet 2 with ASIN/AOV optional)
            </Text>
            <Input
              type="file"
              id="file-upload"
              display="none"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={loading}
            />
            <Button
              variant="outline"
              colorScheme="purple"
              size="md"
              px={6}
              py={5}
              mt={2}
              disabled={loading}
            >
              Browse File
            </Button>
            {file && !error && (
              <Text mt={4} color="green.700" fontWeight="medium">
                Selected: {file.name}
              </Text>
            )}
          </Stack>
        </Box>
      </Box>

      <Box py={4}>
        <Text fontWeight="medium" mb={4} fontSize="lg">
          Target ACOS (%)
        </Text>
        <Flex maxW="400px" align="center">
          <Input
            type="number"
            value={targetAcos}
            onChange={(e) => setTargetAcos(Math.max(0, Number(e.target.value)))}
            min={0}
            maxW="200px"
            size="lg"
            disabled={loading}
          />
          <Button
            variant="ghost"
            size="lg"
            ml={4}
            onClick={decreaseTargetAcos}
            disabled={loading}
          >
            −
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={increaseTargetAcos}
            disabled={loading}
          >
            +
          </Button>
        </Flex>
      </Box>

      <Flex align="center" py={4}>
        <Box
          as="label"
          display="flex"
          alignItems="center"
          cursor={loading ? "not-allowed" : "pointer"}
        >
          <input
            type="checkbox"
            checked={increaseSpendOnPromising}
            onChange={(e) => setIncreaseSpendOnPromising(e.target.checked)}
            style={{
              marginRight: "12px",
              width: "18px",
              height: "18px",
              cursor: "inherit",
            }}
            disabled={loading}
          />
          <Text fontSize="lg" opacity={loading ? 0.6 : 1}>
            Increase spend on promising keywords
          </Text>
        </Box>
        <Box
          ml={2}
          cursor="pointer"
          onClick={showPromisingKeywordsInfo}
          title="Learn more about this option"
        >
          <Icon as={FiInfo} color="gray.400" boxSize={5} />
        </Box>
      </Flex>

      <Button
        colorScheme="purple"
        size="lg"
        onClick={processBidOptimization}
        loading={loading}
        disabled={!file || loading}
        loadingText="Processing..."
      >
        Optimize Bids & Generate File
      </Button>

      <Box mt={4} textAlign="center" minHeight="24px">
        {loading && (
          <Text color="gray.600">
            Processing your file... This may take a moment.
          </Text>
        )}
        {error && !loading && (
          <Text color="red.500" fontWeight="medium">
            Error: {error}
          </Text>
        )}
        {successMessage && !error && !loading && (
          <Text color="green.600" fontWeight="medium">
            {successMessage}
          </Text>
        )}
      </Box>

      {downloadId && !error && !loading && (
        <Box mt={6} textAlign="center">
          <ChakraLink
            href={`http://localhost:8000/api/v1/ppc/download/${downloadId}`}
            target="_blank"
            _hover={{ textDecoration: "none" }}
          >
            <Button colorScheme="green" size="lg">
              <Box mr={2} display="inline-flex" alignItems="center">
                <FiDownload />
              </Box>
              Download Optimized File
            </Button>
          </ChakraLink>
        </Box>
      )}
    </Stack>
  )
}

export default BidOptimizer
