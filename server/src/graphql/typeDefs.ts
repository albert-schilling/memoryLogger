import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type MemoryLog {
    logs: [MemoryLogSession]
    average: MemoryAverage
  }

  type MemoryLogSession {
    # change this to a custom date type
    start: String!
    sessionLogs: [MemoryStatus]
    end: Int
    average: MemoryAverage
  }

  type MemoryStatus {
    clientTimestamp: String
    jsHeapSizeLimit: String
    totalJSHeapSize: String
    usedJSHeapSize: String
    location: String
  }

  input LogDataInput {
    clientTimestamp: String
    jsHeapSizeLimit: String
    totalJSHeapSize: String
    usedJSHeapSize: String
    location: String
  }

  type MemoryAverage {
    number: Int!
    jsHeapSizeLimit: String!
    totalJSHeapSize: String!
    usedJSHeapSize: String!
  }

  type Query {
    memoryLog: MemoryLog!
  }

  type Mutation {
    logMemory(
     log: LogDataInput!
    ): String
    sendMemory(
     log: LogDataInput!
    ): String
  }

  input SendMailMessageInput {
    from: String!
    to: [String!]!
    subject: String!
    text: String
    html: String
  }
`
