---
description: Refactor codebase by analyzing responsibilities and proposing use-case-driven restructuring
model: anthropic/claude-opus-4-5
---

# Responsibility-Driven Refactoring

Refactor the codebase at `$ARGUMENTS` by analyzing code responsibilities and proposing a structure aligned with use cases.

## Core Philosophy

This refactoring is **language-agnostic** and **structure-agnostic**. Instead of prescribing a fixed directory layout, we:

1. **Analyze what the code does** (its responsibilities)
2. **Identify the use cases** it serves
3. **Propose a structure** that reflects those responsibilities
4. **Apply SOLID principles** where they add value

## SOLID Principles (Applied Contextually)

### 1. Single Responsibility Principle (SRP)
- Each module/unit should have only one reason to change
- Group code by what it does, not by technical layer

### 2. Open/Closed Principle (OCP)
- Design for extension without modification
- Use abstractions (interfaces, protocols, traits) to define contracts

### 3. Liskov Substitution Principle (LSP)
- Implementations must honor their contracts
- Substitutable implementations for the same abstraction

### 4. Interface Segregation Principle (ISP)
- Prefer small, focused contracts over large ones
- Clients should not depend on methods they don't use

### 5. Dependency Inversion Principle (DIP)
- Depend on abstractions, not concrete implementations
- High-level policy should not depend on low-level details

## Refactoring Workflow

### Step 1: Deep Analysis

1. **Read all code** in `$ARGUMENTS`

2. **Identify responsibilities** - What does each unit of code do?
   - Input/Output operations (files, network, database, APIs)
   - Data transformation and validation
   - Business rules and domain logic
   - Orchestration and workflow coordination
   - Configuration and initialization
   - Error handling and recovery

3. **Map use cases** - What user/system goals does this code serve?
   - List each distinct use case
   - Trace the code path for each use case
   - Identify shared vs. unique responsibilities

4. **Detect violations**:
   - Units with multiple unrelated responsibilities
   - Hardcoded dependencies between unrelated concerns
   - Tight coupling that prevents independent changes
   - Duplicated logic across different areas

5. **Document findings**:
   ```
   Use Case: [Name]
   - Entry point: [file:line]
   - Responsibilities involved:
     1. [Responsibility A] - [location]
     2. [Responsibility B] - [location]
   - Violations found:
     - [Description of violation]
   ```

### Step 2: Research (Optional)

Use repo-explorer tools to study well-architected projects **in the same domain**:

**When to use**:
- Unfamiliar with idiomatic patterns for this language/framework
- Need inspiration for organizing similar use cases
- Want to validate proposed structure against real projects

**Available tools**:
- `repo_clone` - Clone reference project
- `repo_structure` - Study directory organization
- `repo_search` - Find specific patterns
- `repo_exports` - See public API design
- `repo_deps` - Understand tech stack
- `repo_find` - Locate specific files
- `repo_file` - Read key implementation files
- `repo_cleanup` - Remove cloned repo when done

**Search for projects that**:
- Solve similar problems
- Use the same language/framework
- Have good community reputation

Document insights to inform your restructuring proposal.

### Step 3: Propose Structure Based on Responsibilities

**Do NOT prescribe a fixed structure.** Instead:

1. **Group by responsibility**, not by technical layer
2. **Name directories/modules** after what they do, not what they are
3. **Keep related code together** (high cohesion)
4. **Separate unrelated code** (low coupling)

**Guiding questions**:
- If this responsibility changes, what else needs to change?
- Can this responsibility be tested independently?
- Can this responsibility be replaced without affecting others?
- Does the name clearly communicate what this code does?

**Structure proposal format**:
```
Proposed Structure for: [use case or module name]

[directory/module name] - [responsibility description]
├── [file/submodule] - [specific concern]
├── [file/submodule] - [specific concern]
└── [file/submodule] - [specific concern]

Rationale:
- [Why this grouping makes sense]
- [What changes become easier]
- [What coupling is reduced]
```

### Step 4: Define Abstractions

Create abstractions (interfaces, protocols, traits, contracts) for:

1. **Boundaries between responsibilities**
   - Where one responsibility hands off to another
   - Where external systems are accessed

2. **Variation points**
   - Where different implementations are needed
   - Where behavior might change in the future

3. **Testing seams**
   - Where mocks/stubs would be injected
   - Where integration points need isolation

**Abstraction naming**:
- Name after the capability, not the implementation
- Use domain language when possible
- Keep method signatures minimal

### Step 5: Refactor Implementation

For each unit of code:

1. **Extract** code into appropriate responsibility groups
2. **Inject dependencies** via constructors/parameters
3. **Implement abstractions** where defined
4. **Remove duplication** by sharing common logic
5. **Simplify** public interfaces (hide internal details)

**Refactoring order**:
1. Start with the most isolated responsibilities (fewest dependencies)
2. Work toward orchestration/coordination code
3. End with entry points and composition

### Step 6: Wire Dependencies

Create a **composition root** - a single location where:
- Concrete implementations are instantiated
- Dependencies are wired together
- Configuration is applied

This is the **only place** that knows about concrete implementations.

## Refactoring Checklist

**Before starting**:
- [ ] Read and understand all code in `$ARGUMENTS`
- [ ] List all use cases served by this code
- [ ] Map responsibilities to current locations
- [ ] Identify violations and coupling issues

**Design phase**:
- [ ] Propose structure based on responsibilities
- [ ] Define abstractions for boundaries
- [ ] Plan dependency flow (what depends on what)
- [ ] Validate structure with existing tests/behavior

**Implementation phase**:
- [ ] Refactor incrementally (one responsibility at a time)
- [ ] Run tests after each change
- [ ] Update imports/references as code moves
- [ ] Maintain backward compatibility where needed

**After refactoring**:
- [ ] All tests pass
- [ ] Linting/formatting passes
- [ ] Type checking passes (if applicable)
- [ ] Documentation updated
- [ ] Review SOLID compliance

## Verification

### Automated Checks
Run the project's existing test/lint/type-check commands. Do not assume specific tools.

### Manual Verification
- [ ] Each unit has a single, clear responsibility
- [ ] Dependencies are injected, not hardcoded
- [ ] Abstractions are minimal and focused
- [ ] Orchestration code only coordinates, no business logic
- [ ] New implementations can be added without modifying existing code
- [ ] Units can be tested in isolation

## Expected Benefits

**Testability**
- Mock abstractions for unit testing
- Test responsibilities in isolation
- Clear boundaries for integration tests

**Extensibility**
- Add new implementations without modifying existing code
- Swap implementations for different contexts
- Compose behaviors differently

**Maintainability**
- Clear, single responsibility per unit
- Easy to locate relevant code
- Changes isolated to specific areas

**Understandability**
- Structure reflects what the code does
- Names communicate purpose
- Dependencies are explicit

## Common Patterns (Apply Where Appropriate)

### Strategy Pattern
Multiple implementations of the same responsibility:
```
[Abstraction] defines the contract
[ImplementationA] handles case A
[ImplementationB] handles case B
```

### Repository Pattern
Abstraction over data access:
```
[Repository abstraction] defines data operations
[Implementation] handles specific storage mechanism
```

### Use Case / Interactor Pattern
Orchestration of a single user goal:
```
[Use case] coordinates responsibilities
[Dependencies] are injected abstractions
[Execution] returns result or signals completion
```

### Composition Root Pattern
Single location for wiring:
```
[Entry point] creates concrete implementations
[Entry point] wires dependencies
[Entry point] invokes use case
```

## Important Guidelines

1. **Understand before changing** - Read all code thoroughly first
2. **Refactor incrementally** - Small, tested steps
3. **Preserve behavior** - No functional changes during refactoring
4. **Follow existing conventions** - Match the project's style
5. **Don't over-engineer** - Apply patterns where they add value
6. **Track progress** - Use TodoWrite to manage tasks
7. **Communicate changes** - Document restructuring decisions

## Example Output

After running `/refactor src/order_processing`, you should see:

```
Refactoring Analysis Complete!

**Use Cases Identified**:
1. Create Order - validates items, calculates totals, persists order
2. Process Payment - charges payment method, updates order status
3. Ship Order - generates shipping label, notifies customer

**Responsibilities Found**:
- Order validation (scattered across 3 files)
- Price calculation (duplicated in 2 places)
- Database access (mixed with business logic)
- Email notifications (hardcoded in order flow)
- Payment gateway integration (tightly coupled)

**Proposed Structure**:

orders/
├── create_order      - Orchestrates order creation
├── process_payment   - Orchestrates payment flow
├── ship_order        - Orchestrates shipping flow
├── validation        - Order validation rules
├── pricing           - Price calculation logic
├── notifications     - Customer notification contracts
└── persistence       - Order storage contracts

integrations/
├── payment_gateway   - Payment provider implementation
├── shipping_provider - Shipping label implementation
└── email_sender      - Email notification implementation

**SOLID Compliance**:
- SRP: Each module has single responsibility
- OCP: New payment/shipping providers via abstractions
- LSP: All implementations honor contracts
- ISP: Focused interfaces per responsibility
- DIP: Use cases depend on abstractions

**Verification**:
- All existing tests pass
- New structure matches use case flow
- Dependencies injected at entry points

Ready to implement!
```

## Notes

- Structure should **emerge from responsibilities**, not be imposed
- The goal is **clarity and maintainability**, not architectural purity
- Apply principles **pragmatically** - don't force patterns where they don't fit
- **Existing project conventions** take precedence over generic recommendations
- When in doubt, **optimize for understanding** - code is read more than written
