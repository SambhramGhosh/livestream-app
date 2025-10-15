
from flask import Blueprint, request, jsonify
from models_overlay import create_overlay, get_all_overlays, get_overlay, update_overlay, delete_overlay

overlay_bp = Blueprint('overlay_bp', __name__)


@overlay_bp.route('/', methods=['POST'])
def create():
    payload = request.get_json()
    if not payload:
        return jsonify({'error': 'Invalid JSON payload'}), 400
    oid = create_overlay(payload)
    return jsonify({'id': oid}), 201


@overlay_bp.route('/', methods=['GET'])
def list_all():
    docs = get_all_overlays()
    return jsonify(docs), 200


@overlay_bp.route('/<oid>', methods=['GET'])
def read(oid):
    doc = get_overlay(oid)
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(doc), 200


@overlay_bp.route('/<oid>', methods=['PUT'])
def update(oid):
    payload = request.get_json()
    if not payload:
        return jsonify({'error': 'Invalid JSON payload'}), 400
    updated = update_overlay(oid, payload)
    if not updated:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(updated), 200


@overlay_bp.route('/<oid>', methods=['DELETE'])
def delete(oid):
    ok = delete_overlay(oid)
    if not ok:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'deleted': True}), 200
