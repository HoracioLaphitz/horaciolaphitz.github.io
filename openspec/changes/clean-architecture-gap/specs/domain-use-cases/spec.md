# Domain Use-Cases Specification

## Purpose

Define the behavior of application-level use-cases that orchestrate domain repositories and return presentation-ready data to Astro pages.

## Requirements

### Requirement: Use-case projects — must return typed DTOs

The system MUST expose a use-case function `getProjectsUseCase` that accepts an `IProjectRepository` and returns an array of serializable DTOs.

#### Scenario: Returns all projects with complete data

- GIVEN an `IProjectRepository` that resolves a list of `Project` entities
- WHEN `getProjectsUseCase.findAll()` is called
- THEN the result MUST be an array of `ProjectDTO` objects without class methods
- AND each DTO MUST contain `title`, `description`, `slug`, `technologies`, `featured`, `category`, `links`, and `images`

#### Scenario: Filtered queries propagate correctly

- GIVEN an `IProjectRepository` with filtered `findFeatured()` or `findByCategory()` methods
- WHEN calling the corresponding use-case method
- THEN the use-case MUST delegate to the same repository method
- AND return the filtered list as DTOs

#### Scenario: Single project lookup by slug

- GIVEN an `IProjectRepository` that may or may not contain a project with slug `"my-project"`
- WHEN `getProjectsUseCase.findBySlug("my-project")` is called
- THEN the result MUST be a `ProjectDTO` if found, or `null` if not

### Requirement: Use-case profile — must compose multiple data sources

The system MUST expose a use-case `getProfileUseCase` that accepts a profile repository and returns a single serializable DTO.

#### Scenario: Returns a complete profile with contact, skills, and experience

- GIVEN repositories that resolve profile, contact, and skills data
- WHEN `getProfileUseCase.execute()` is called
- THEN the result MUST be a `ProfileDTO` containing all profile fields, contact info, skills array, and recent experience summary
- AND the DTO MUST be serializable (plain object, no class instances)

#### Scenario: Missing optional fields

- GIVEN repositories that resolve a profile with missing contact or empty skills
- WHEN `getProfileUseCase.execute()` is called
- THEN the DTO MUST omit absent optional fields or set them to `undefined`
- AND MUST NOT throw or crash

### Requirement: Use-case experience — must return sorted timeline data

The system MUST expose a use-case `getExperienceUseCase` that accepts experience and education repositories and returns combined timeline DTOs.

#### Scenario: Returns combined and sorted experience array

- GIVEN an `IExperienceRepository` that resolves work experiences and an education repository
- WHEN `getExperienceUseCase.execute()` is called
- THEN the result MUST be an array of `TimelineEntryDTO` objects sorted by date descending

#### Scenario: Empty repositories

- GIVEN repositories that return empty arrays for both experience and education
- WHEN `getExperienceUseCase.execute()` is called
- THEN the result MUST be an empty array
