# Static Repositories Specification

## Purpose

Define the behavior of concrete repository implementations that read from static JSON manifests and conform to the domain repository interfaces.

## Requirements

### Requirement: Static project repository — must implement IProjectRepository

The system MUST provide a `ProjectStaticRepository` class that implements `IProjectRepository` and reads from the generated project JSON manifest.

#### Scenario: Returns all projects from JSON file

- GIVEN a project JSON manifest at `src/data/generated/projects.json`
- WHEN `ProjectStaticRepository.findAll()` is called
- THEN the result MUST be a `Promise<Project[]>` containing all projects from the manifest
- AND each project MUST pass through the project mapper to become a domain entity

#### Scenario: findBySlug returns null for missing slug

- GIVEN a project JSON manifest that does not contain a project with slug `"nonexistent"`
- WHEN `ProjectStaticRepository.findBySlug("nonexistent")` is called
- THEN the result MUST resolve to `null`

#### Scenario: findByCategory filters correctly

- GIVEN a project JSON manifest with projects in categories `"web"`, `"mobile"`, and `"data"`
- WHEN `ProjectStaticRepository.findByCategory("mobile")` is called
- THEN the result MUST include only projects whose category matches `"mobile"`

### Requirement: Static experience repository — must implement IExperienceRepository

The system MUST provide an `ExperienceStaticRepository` class that implements `IExperienceRepository` and reads from the generated experience JSON manifest.

#### Scenario: Returns all experience entries

- GIVEN an experience JSON manifest at `src/data/generated/experience.json`
- WHEN `ExperienceStaticRepository.findAll()` is called
- THEN the result MUST be a `Promise<Experience[]>` containing all entries
- AND each entry MUST pass through the experience mapper

#### Scenario: Empty or missing manifest file

- GIVEN a missing or empty experience manifest JSON file
- WHEN `ExperienceStaticRepository.findAll()` is called
- THEN the result MUST resolve to an empty array
- AND MUST NOT throw an error

### Requirement: Static profile repository — must return profile, contact, and skills data

The system MUST provide a static repository that reads profile, contact, and skills data from JSON manifests and returns plain typed objects.

#### Scenario: Returns full profile data

- GIVEN a profile JSON manifest with name, role, descriptions, contact, and skills
- WHEN the profile repository's method is called
- THEN the result MUST contain all profile fields with correct types
- AND skills MUST be typed as `Skill[]`

#### Scenario: Handles missing optional contact fields

- GIVEN a profile JSON manifest where some contact fields are absent
- WHEN the profile repository's method is called
- THEN the result MUST NOT include the absent fields
- AND MUST NOT throw

### Requirement: Repositories must be stateless and idempotent

The system MUST ensure that all static repository methods are idempotent — calling the same method multiple times MUST return equivalent data each time.

#### Scenario: Multiple calls return same data

- GIVEN a static repository instantiated once
- WHEN `findAll()` is called three times sequentially
- THEN each call MUST resolve to the same array of entities (deep equal)

#### Scenario: Parallel calls do not interfere

- GIVEN a static repository
- WHEN two parallel `findAll()` calls are made
- THEN both MUST resolve successfully with the same data
- AND neither call SHALL affect the other
