# DI Container Specification

## Purpose

Define the behavior of the dependency injection container that wires repository implementations to use-cases and allows swapping implementations without changing consumer code.

## Requirements

### Requirement: Container must register and resolve repository bindings

The system MUST provide a container that accepts repository implementations by interface and resolves them for use-case consumption.

#### Scenario: Register and resolve a concrete repository

- GIVEN a container and a `ProjectStaticRepository` instance
- WHEN the repository is registered with key `"IProjectRepository"` and then resolved
- THEN the resolved value MUST be the same instance that was registered

#### Scenario: Resolve unregistered binding returns null

- GIVEN a container with no registrations
- WHEN attempting to resolve key `"IProfileRepository"`
- THEN the container MUST return `null` or `undefined`
- AND MUST NOT throw

### Requirement: Container must support default static bindings

The system MUST pre-configure static repository implementations as default bindings so that use-cases can be consumed without additional setup.

#### Scenario: Default bindings resolve correctly

- GIVEN the container with default `StaticRepository` bindings
- WHEN resolving `"IProjectRepository"`, `"IExperienceRepository"`, and the profile repository
- THEN each MUST resolve to its respective static implementation
- AND each resolved repository MUST be functional (can call `findAll()`)

#### Scenario: Rebind to API implementation

- GIVEN a container with a default `ProjectStaticRepository` bound to `"IProjectRepository"`
- WHEN rebinding `"IProjectRepository"` to a `ProjectApiRepository` instance
- THEN `resolve("IProjectRepository")` MUST return the API repository
- AND the previous binding MUST be replaced, not stacked

### Requirement: Container must integrate with Astro page lifecycle

The system MUST ensure that use-cases with resolved dependencies can be called from Astro pages during SSG build and at request time.

#### Scenario: Astro page calls use-case via container

- GIVEN an Astro page that imports the container and resolves a use-case
- WHEN the page script executes during SSG build
- THEN the container MUST resolve the correct static repository
- AND the use-case MUST return data without network calls

#### Scenario: Build-time resilience

- GIVEN an Astro SSG build where a JSON manifest file is temporarily unavailable
- WHEN a use-case is resolved and called
- THEN the repository SHOULD gracefully return an empty result
- AND the build SHALL NOT fail with unhandled rejection

### Requirement: Container must be a singleton

The system MUST provide a single container instance shared across the application.

#### Scenario: Multiple imports share the same container

- GIVEN two separate modules that import the container
- WHEN one module registers a binding
- THEN the other module SHALL see the same binding when resolving
