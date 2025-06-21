import { test, expect } from '@playwright/test';

test.describe('ModelCraft Core Functionalities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="rf__wrapper"]')).toBeVisible({timeout: 10000});

    // Create a new, empty project for each test to ensure a clean state
    const newProjectTriggerButton = page.locator('h3:has-text("Project Explorer")').locator('..').getByRole('button');
    await expect(newProjectTriggerButton).toBeVisible();
    await newProjectTriggerButton.click();

    const newProjectNameDialogInput = page.getByRole('dialog').locator('input[placeholder="Enter project name"]');
    await expect(newProjectNameDialogInput).toBeVisible({timeout: 5000});
    const newProjectActualName = `TestSetupProject-${Date.now()}`;
    await newProjectNameDialogInput.fill(newProjectActualName);
    // Ensure the "Create Project" button is specific to the dialog if multiple exist
    await page.getByRole('dialog').getByRole('button', {name: 'Create Project'}).click();

    // Wait for the new project to be loaded and canvas to be empty or ready
    // Check for toast message confirming project creation
    await expect(page.getByText(`Project ${newProjectActualName} created successfully!`)).toBeVisible({timeout: 10000});
    await expect(page.locator('.react-flow__node-entity')).toHaveCount(0, { timeout: 10000 }); // Ensure canvas is empty
  });

  test('should allow creating an entity, renaming it, and adding an attribute', async ({ page }) => {
    // Drag "Entity" from sidebar to canvas
    const draggableEntity = page.getByText('Entity', { exact: true }).locator('xpath=ancestor::div[contains(@class, "cursor-grab")]');
    const canvas = page.locator('[data-testid="rf__wrapper"]');

    // Attempt dragTo with specific source and target positions
    const canvasBoundingBox = await canvas.boundingBox();
    if (!canvasBoundingBox) throw new Error("Canvas bounding box not found");

    await draggableEntity.dragTo(canvas, {
      sourcePosition: { x: 1, y: 1 }, // Click at the top-left of the draggable element
      targetPosition: { x: canvasBoundingBox.width / 2, y: canvasBoundingBox.height / 2 }, // Drop in the center of the canvas
    });

    // Add a slight delay to allow React state updates / rendering
    await page.waitForTimeout(1000);

    // Increased timeout and ensuring we are looking for the specific new entity.
    await page.waitForSelector('.react-flow__node-entity:has-text("NewEntity")', { state: 'visible', timeout: 20000 });
    const entityNode = page.locator('.react-flow__node-entity:has-text("NewEntity")').first();
    await expect(entityNode).toBeVisible();
    await entityNode.click({delay: 200, force: true });

    // Edit entity name in the right panel
    // The input for entity name is preceded by a label "Name"
    const entityNameLabel = page.getByText('Name', { exact: true }).locator('..'); // Parent of label
    const entityNameInput = entityNameLabel.locator('input').first();
    await expect(entityNameInput).toBeVisible();
    await entityNameInput.fill('Customer');
    await expect(entityNameInput).toHaveValue('Customer');

    // Verify name updated on canvas
    await expect(entityNode.getByText('Customer')).toBeVisible();

    // Add an attribute in the right panel
    const addAttributeButton = page.getByRole('button', { name: 'Add', exact: true });
    await expect(addAttributeButton).toBeVisible();
    await addAttributeButton.click();

    // Edit the new attribute
    // Attribute name input is not directly labeled with aria-label, find by placeholder or surrounding elements
    const attributeNameInput = page.locator('input[value="new_field"]').last();
    await expect(attributeNameInput).toBeVisible();
    await attributeNameInput.fill('customerId');
    await expect(attributeNameInput).toHaveValue('customerId');

    // Attribute type select. The select itself doesn't have a direct label.
    // It's likely the one associated with the 'customerId' attribute.
    // Let's find the SelectTrigger next to the input we just filled.
    const attributeRow = page.locator('.border.border-gray-200.rounded-lg.p-3').filter({ hasText: 'customerId' });
    const attributeTypeSelectTrigger = attributeRow.locator('[role="combobox"]'); // SelectTrigger
    await expect(attributeTypeSelectTrigger).toBeVisible();
    await attributeTypeSelectTrigger.click(); // Open select
    await page.getByRole('option', { name: 'int' }).click(); // Select 'int'

    // Verify attribute added in the properties panel
    await expect(page.locator('input[value="customerId"]')).toBeVisible();

    // Verify attribute reflected in the entity on canvas
    await expect(entityNode.getByText('customerId: int')).toBeVisible();
  });

  test('should allow saving and loading a project', async ({ page }) => {
    // Create a simple model by dragging an entity
    const draggableEntity = page.getByText('Entity', { exact: true }).locator('..');
    const canvas = page.locator('[data-testid="rf__wrapper"]');
    await draggableEntity.dragTo(canvas, { targetPosition: { x: 400, y: 200 } });

    const entityNode = page.locator('.react-flow__node-entity').first();
    await expect(entityNode).toBeVisible();
    await entityNode.click();

    const entityNameLabel = page.getByText('Name', { exact: true }).locator('..');
    const entityNameInput = entityNameLabel.locator('input').first();
    await entityNameInput.fill('Product');
    await expect(entityNameInput).toHaveValue('Product');
    await expect(entityNode.getByText('Product')).toBeVisible();

    // Save the project
    const saveModelButton = page.getByRole('button', { name: 'Save Model' });
    await expect(saveModelButton).toBeVisible();
    await saveModelButton.click();

    // The save dialog should appear. Input project name.
    const projectName = 'TestProject-' + Date.now();
    const projectNameInput = page.locator('input[placeholder="Enter project name"]');
    await expect(projectNameInput).toBeVisible({ timeout: 5000 }); // Wait for dialog
    await projectNameInput.fill(projectName);

    // Click the "Save" button within the dialog
    const saveDialogButton = page.getByRole('dialog').getByRole('button', { name: 'Save' }); // Standard dialog save button
    await expect(saveDialogButton).toBeVisible();
    await saveDialogButton.click();

    // Wait for save confirmation (e.g., a toast message)
    await expect(page.getByText('Project saved successfully', { exact: true })).toBeVisible({ timeout: 10000 });


    // Create a new empty project
    // The "New Project" button is a Plus icon in the "Project Explorer"
    const newProjectTriggerButton = page.locator('h3:has-text("Project Explorer")').locator('..').getByRole('button');
    await expect(newProjectTriggerButton).toBeVisible();
    await newProjectTriggerButton.click();

    // Dialog for new project name
    const newProjectNameDialogInput = page.getByRole('dialog').locator('input[placeholder="Enter project name"]');
    await expect(newProjectNameDialogInput).toBeVisible({timeout: 5000});
    const newProjectActualName = 'EmptyProject-' + Date.now();
    await newProjectNameDialogInput.fill(newProjectActualName);
    await page.getByRole('dialog').getByRole('button', {name: 'Create Project'}).click();

    // Wait for new project to be active and canvas to be empty
    await expect(page.getByText(newProjectActualName, { exact: true })).toBeVisible({timeout: 10000}); // Check if new project is listed
    await expect(page.locator('.react-flow__node-entity')).toHaveCount(0, { timeout: 10000 });


    // Load the saved project (TestProject-...)
    // Projects are listed in the sidebar. Find and click the previously saved project.
    // The project list item might be a div containing the name.
    const projectToLoad = page.locator('.space-y-1 > div').filter({ hasText: projectName }).first();
    await expect(projectToLoad).toBeVisible();
    await projectToLoad.click();

    // Verify the loaded project's content
    await expect(page.locator('.react-flow__node-entity').getByText('Product')).toBeVisible({ timeout: 10000 });
  });

  test('should allow generating code', async ({ page }) => {
    // Create a simple model
    const draggableEntity = page.getByText('Entity', { exact: true }).locator('..');
    const canvas = page.locator('[data-testid="rf__wrapper"]');
    await draggableEntity.dragTo(canvas, { targetPosition: { x: 400, y: 200 } });

    const entityNode = page.locator('.react-flow__node-entity').first();
    await expect(entityNode).toBeVisible();
    await entityNode.click();

    const entityNameLabel = page.getByText('Name', { exact: true }).locator('..');
    const entityNameInput = entityNameLabel.locator('input').first();
    await entityNameInput.fill('Order');
    await expect(entityNameInput).toHaveValue('Order');
    await expect(entityNode.getByText('Order')).toBeVisible();

    // Click the "Export Code" button
    const exportCodeButton = page.getByRole('button', { name: 'Export Code' });
    await expect(exportCodeButton).toBeVisible();

    // Listen for download event if code is downloaded
    const downloadPromise = page.waitForEvent('download');
    await exportCodeButton.click();
    const download = await downloadPromise;

    // Verify download (name, content type, etc.)
    expect(download.suggestedFilename()).toMatch(/.*\.py/); // Example: check for Python file extension

    // If code is displayed in a modal/dialog instead of download:
    // await expect(page.locator('div[role="dialog"]')).toBeVisible();
    // const codeContent = await page.locator('pre > code').textContent(); // Adjust selector
    // expect(codeContent).toContain('class Order:');
  });
});
