import {
  Button,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay, 
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text
} from '@chakra-ui/react'
import React from 'react'

function Profile({user,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
        {children?
        <span onClick={onOpen}>{children}</span>:
        <i className="fa fa-eye" aria-hidden="true" onClick={onOpen} style={{padding:"0.2rem 2rem"}}></i>
        }


        <Modal size="lg" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader>{user.username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
          alignItems="center"
          >
            <Image 
                src={user.profile} alt="Profile"
                borderRadius="full"
                boxSize="230px"
            />
            <Text>Email :{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Profile