import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import styled from "styled-components"

import {
  type ApiError,
  type UserPublic,
  type UserUpdateMe,
  UsersService,
} from "@/client"
import useAuth from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"
import { Field } from "../ui/field"

const StyledHeading = styled(Heading)`
  color: #3a1a5e;
  font-weight: 600;
`

const StyledInput = styled(Input)`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(156, 39, 176, 0.2);
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #9c27b0;
    box-shadow: 0 0 0 1px rgba(156, 39, 176, 0.3);
  }
`

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
  color: white;
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(156, 39, 176, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    background: linear-gradient(135deg, #9c27b0 0%, #673ab7 100%);
    color: white;
  }
`

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #666;
  border: 1px solid rgba(156, 39, 176, 0.3);
  
  &:hover {
    background: rgba(156, 39, 176, 0.05);
  }
`

const UserInformation = () => {
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const [editMode, setEditMode] = useState(false)
  const { user: currentUser } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UserPublic>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name,
      email: currentUser?.email,
    },
  })

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) =>
      UsersService.updateUserMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("User updated successfully.")
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries()
    },
  })

  const onSubmit: SubmitHandler<UserUpdateMe> = async (data) => {
    mutation.mutate(data)
  }

  const onCancel = () => {
    reset()
    toggleEditMode()
  }

  return (
    <>
      <Container maxW="full">
        <StyledHeading size="sm" py={4}>
          User Information
        </StyledHeading>
        <Box
          w={{ sm: "full", md: "sm" }}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Field label="Full name">
            {editMode ? (
              <StyledInput
                {...register("full_name", { maxLength: 30 })}
                type="text"
                size="md"
              />
            ) : (
              <Text
                fontSize="md"
                py={2}
                color={!currentUser?.full_name ? "gray" : "inherit"}
                truncate
                maxW="sm"
              >
                {currentUser?.full_name || "N/A"}
              </Text>
            )}
          </Field>
          <Field
            mt={4}
            label="Email"
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            {editMode ? (
              <StyledInput
                {...register("email", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                type="email"
                size="md"
              />
            ) : (
              <Text fontSize="md" py={2} truncate maxW="sm">
                {currentUser?.email}
              </Text>
            )}
          </Field>
          <Flex mt={4} gap={3}>
            <PrimaryButton
              onClick={toggleEditMode}
              type={editMode ? "button" : "submit"}
              loading={editMode ? isSubmitting : false}
              disabled={editMode ? !isDirty || !getValues("email") : false}
            >
              {editMode ? "Save" : "Edit"}
            </PrimaryButton>
            {editMode && (
              <SecondaryButton
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </SecondaryButton>
            )}
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default UserInformation
