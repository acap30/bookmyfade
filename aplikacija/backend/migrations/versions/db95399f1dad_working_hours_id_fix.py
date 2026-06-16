"""working_hours_id_fix

Revision ID: db95399f1dad
Revises: 39f60ee90448
Create Date: 2026-06-16 12:57:33.258740

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'db95399f1dad'
down_revision: Union[str, Sequence[str], None] = '39f60ee90448'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Drop old composite primary key
    op.drop_constraint("PRIMARY", "Radno_vreme", type_="primary")

    # 2. Set new primary key on id only
    op.create_primary_key(
        "pk_radno_vreme",
        "Radno_vreme",
        ["id"],
    )

    # 3. Make id auto-increment (MySQL requires this change via alter_column)
    op.alter_column(
        "Radno_vreme",
        "id",
        existing_type=mysql.INTEGER(),
        nullable=False,
        autoincrement=True,
    )

    

    # 4. (Recommended) prevent duplicate weekdays per hairdresser
    op.create_unique_constraint(
        "uq_hairdresser_weekday",
        "Radno_vreme",
        ["hairdresser_id", "weekday"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    # 1. Remove unique constraint
    op.drop_constraint("uq_hairdresser_weekday", "Radno_vreme", type_="unique")

    op.alter_column(
        "Radno_vreme",
        "id",
        existing_type=mysql.INTEGER(),
        nullable=False,
        autoincrement=False,
    )

    # 2. Drop new primary key
    op.drop_constraint("pk_radno_vreme", "Radno_vreme", type_="primary")

    # 3. Restore old composite primary key
    op.create_primary_key(
        "PRIMARY",
        "Radno_vreme",
        ["id", "hairdresser_id"],
    )

    # 4. Revert id autoincrement behavior
    
