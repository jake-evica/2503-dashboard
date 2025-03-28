import { Box, Container, Flex, Heading, Image, Input, Text } from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock, FiMail } from "react-icons/fi"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { emailPattern, passwordRules } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // error is handled by useAuth hook
    }
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      p={4}
      bgGradient="linear(to-br, #0f0c29, #302b63, #24243e)"
    >
      <Box
        w="full"
        maxW="md"
        p={8}
        borderRadius="xl"
        bg="whiteAlpha.50"
        backdropFilter="blur(10px)"
        borderWidth={1}
        borderColor="whiteAlpha.100"
        boxShadow="2xl"
      >
        <Flex justify="center" mb={8}>
          <Heading
            as="h1"
            fontSize="4xl"
            textAlign="center"
            color="white"
            fontWeight="bold"
            letterSpacing="wider"
            lineHeight="1.4"
            textShadow="0 0 20px rgba(66, 153, 225, 0.5)"
            transition="all 0.3s ease"
            _hover={{ 
              transform: 'scale(1.05)',
              textShadow: "0 0 30px rgba(99, 179, 237, 0.8)"
            }}
            css={{
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": {
                  opacity: 1,
                  textShadow: "0 0 20px rgba(66, 153, 225, 0.5)"
                },
                "50%": {
                  opacity: 0.8,
                  textShadow: "0 0 30px rgba(99, 179, 237, 0.8)"
                },
                "100%": {
                  opacity: 1,
                  textShadow: "0 0 20px rgba(66, 153, 225, 0.5)"
                }
              }
            }}
          >
            Systems Lab{"\n"}Dashboard
          </Heading>
        </Flex>
        
        <Box as="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={6}>
          <Field
            invalid={!!errors.username}
            errorText={errors.username?.message || !!error}
          >
            <InputGroup w="100%" startElement={<FiMail color="#A78BFA" />}>
              <Input
                id="username"
                {...register("username", {
                  required: "Username is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
                bg="whiteAlpha.50"
                borderColor="purple.500"
                borderRadius="xl"
                py={3}
                px={4}
                _focus={{
                  borderColor: "purple.400",
                  boxShadow: "0 0 0 1px rgba(167, 139, 250, 0.2)",
                }}
              />
            </InputGroup>
          </Field>
          
          <PasswordInput
            type="password"
            startElement={<FiLock color="#A78BFA" />}
            {...register("password", passwordRules())}
            placeholder="Password"
            errors={errors}
            bg="whiteAlpha.50"
            borderColor="purple.500"
            borderRadius="xl"
            py={3}
            px={4}
            _focus={{
              borderColor: "purple.400",
              boxShadow: "0 0 0 1px rgba(167, 139, 250, 0.2)",
            }}
          />
          
          <Flex justify="flex-end" mt={2}>
            <RouterLink 
              to="/recover-password" 
              style={{
                color: '#A78BFA',
                fontSize: '14px',
                transition: 'color 0.2s',
              }}
            >
              Forgot Password?
            </RouterLink>
          </Flex>
          
          <Button 
            variant="solid" 
            type="submit" 
            loading={isSubmitting} 
            size="lg"
            w="full"
            mt={4}
            bg="#4299E1"
            color="white"
            _hover={{
              bg: "#63B3ED",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(99, 179, 237, 0.4)"
            }}
            _active={{
              bg: "#90CDF4",
              transform: "translateY(0)",
            }}
            transition="all 0.2s"
            borderRadius="xl"
            boxShadow="0 2px 8px rgba(66, 153, 225, 0.2)"
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Flex>
  )
}
