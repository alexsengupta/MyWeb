from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table


# revision identifiers, used by Alembic.
revision = '55f1f71e489e'
down_revision = 'ab7a483d1cb3'
branch_labels = None
depends_on = None


def upgrade():
    # Create a temporary table with the new schema
    op.create_table('_alembic_tmp_user',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(100), nullable=False, unique=True),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('password', sa.String(200), nullable=False),
        sa.Column('profile', sa.String(200)),
        sa.Column('notifications', sa.Boolean, default=True),
        sa.Column('admin', sa.Boolean, default=False)
    )

    # Copy data from the old table to the new temporary table
    old_user = table('user',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('password', sa.String(200), nullable=False),
        sa.Column('profile', sa.String(200)),
        sa.Column('notifications', sa.Boolean, default=True),
        sa.Column('admin', sa.Boolean, default=False)
    )
    op.execute(
        '''
        INSERT INTO _alembic_tmp_user (id, username, email, password, profile, notifications, admin)
        SELECT id, name, email, password, profile, notifications, admin
        FROM user
        '''
    )

    # Drop the old table
    op.drop_table('user')

    # Rename the temporary table to the original table name
    op.rename_table('_alembic_tmp_user', 'user')


def downgrade():
    # Revert the upgrade process
    op.create_table('_alembic_tmp_user',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('password', sa.String(200), nullable=False),
        sa.Column('profile', sa.String(200)),
        sa.Column('notifications', sa.Boolean, default=True),
        sa.Column('admin', sa.Boolean, default=False)
    )

    old_user = table('user',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(100), nullable=False, unique=True),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('password', sa.String(200), nullable=False),
        sa.Column('profile', sa.String(200)),
        sa.Column('notifications', sa.Boolean, default=True),
        sa.Column('admin', sa.Boolean, default=False)
    )
    op.execute(
        '''
        INSERT INTO _alembic_tmp_user (id, name, email, password, profile, notifications, admin)
        SELECT id, username, email, password, profile, notifications, admin
        FROM user
        '''
    )

    op.drop_table('user')
    op.rename_table('_alembic_tmp_user', 'user')
